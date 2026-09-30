"""
StreamForge Bytewax Dataflow

This module defines the actual Bytewax dataflow for processing truck
temperature telemetry. It uses:

- KafkaSource (confluent_kafka via bytewax.connectors.kafka)
  for reading from the 'truck-temperature' Kafka topic.
- EventClock + TumblingWindower for 5-minute tumbling windows.
- fold_window for per-truck temperature aggregation.
- JSON state persistence for fault tolerance.

The flow can be run via:
    python -m bytewax.run app.stream.bytewax_flow:build_flow

Or from the stream worker:
    python -m app.workers.stream_worker
"""

import json
import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Optional

from bytewax.dataflow import Dataflow
from bytewax import operators as op
from bytewax.operators.windowing import (
    EventClock,
    TumblingWindower,
    fold_window,
)

from app.stream.aggregation import (
    TruckWindowManager,
    WindowAggState,
    window_manager,
)
from app.config.settings import settings

logger = logging.getLogger(__name__)

# ============================================================
# Configuration
# ============================================================

KAFKA_BROKERS = [settings.KAFKA_BOOTSTRAP_SERVER]
KAFKA_TOPIC = getattr(settings, "KAFKA_TOPIC_TEMPERATURE", "truck-temperature")
WINDOW_SIZE = timedelta(minutes=5)
ALLOWED_LATENESS = timedelta(minutes=2)


# ============================================================
# Helper functions for Bytewax operators
# ============================================================


def _parse_kafka_message(msg_bytes: bytes) -> Optional[dict]:
    """Parse a Kafka message value from bytes to dict."""
    try:
        if isinstance(msg_bytes, (bytes, bytearray)):
            return json.loads(msg_bytes.decode("utf-8"))
        if isinstance(msg_bytes, str):
            return json.loads(msg_bytes)
        if isinstance(msg_bytes, dict):
            return msg_bytes
        return None
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        logger.warning(f"Failed to parse Kafka message: {e}")
        return None


def _extract_key(event: dict) -> tuple[str, dict]:
    """Extract the truck_id as the key for keyed operations."""
    truck_id = event.get("truck_id", "unknown")
    return (truck_id, event)


def _extract_event_time(event: dict) -> datetime:
    """Extract the event timestamp for EventClock."""
    ts = event.get("timestamp")
    if ts:
        try:
            dt = datetime.fromisoformat(ts)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except (ValueError, TypeError):
            pass
    return datetime.now(timezone.utc)


def _window_fold_init() -> WindowAggState:
    """Initialize a new window accumulator."""
    return WindowAggState()


def _window_fold_merge(acc: WindowAggState, event: dict) -> WindowAggState:
    """Fold an event into the window accumulator."""
    temp = event.get("temperature", 0.0)
    ts = event.get("timestamp", datetime.now(timezone.utc).isoformat())
    event_id = event.get("event_id")
    try:
        temp = float(temp)
    except (ValueError, TypeError):
        return acc
    acc.merge(temp, ts, event_id)
    return acc


def _format_window_result(key_meta_acc: tuple) -> dict:
    """Format the windowed aggregation result for output."""
    truck_id, (meta, acc) = key_meta_acc
    return {
        "truck_id": truck_id,
        "window_start": meta.open_time.isoformat() if hasattr(meta, 'open_time') else str(meta),
        "window_end": (meta.open_time + WINDOW_SIZE).isoformat() if hasattr(meta, 'open_time') else "unknown",
        "window_type": "tumbling_5min",
        **acc.summary(),
    }


# ============================================================
# Bytewax Dataflow Builder
# ============================================================


def build_flow() -> Dataflow:
    """
    Build the Bytewax dataflow for processing truck temperature events.

    Pipeline:
        KafkaSource → parse → key_on(truck_id) → fold_window(5min) → output

    Returns a Dataflow instance that can be executed with bytewax.run.
    """
    flow = Dataflow("streamforge_temperature")

    try:
        from bytewax.connectors.kafka import KafkaSource

        kafka_source = KafkaSource(
            brokers=KAFKA_BROKERS,
            topics=[KAFKA_TOPIC],
            add_config={
                "group.id": "streamforge-bytewax",
                "auto.offset.reset": "earliest",
                "enable.auto.commit": "true",
            },
        )
        kafka_input = op.input("kafka_in", flow, kafka_source)
        # KafkaSource yields KafkaSourceMessage with .key and .value
        raw_events = op.map("extract_value", kafka_input, lambda msg: msg.value)
    except Exception as e:
        logger.warning(f"Could not create KafkaSource: {e}. Using empty source.")
        from bytewax.testing import TestingSource
        kafka_input = op.input("kafka_in", flow, TestingSource([]))
        raw_events = kafka_input

    # Parse JSON messages
    parsed = op.filter_map("parse", raw_events, _parse_kafka_message)

    # Key by truck_id for per-truck windowing
    keyed = op.key_on("key_on_truck", parsed, lambda e: e.get("truck_id", "unknown"))

    # Define windowing: 5-minute tumbling windows with event-time clock
    clock = EventClock(
        ts_getter=lambda _key, event: _extract_event_time(event),
        wait_for_system_duration=ALLOWED_LATENESS,
    )
    windower = TumblingWindower(length=WINDOW_SIZE)

    # Fold events into window accumulators
    windowed = fold_window(
        "temp_window",
        keyed,
        clock=clock,
        windower=windower,
        builder=_window_fold_init,
        folder=_window_fold_merge,
    )

    # Format results
    results = op.map("format_result", windowed.down, _format_window_result)

    # Output: log and feed to window manager
    def _output_result(result: dict):
        logger.info(
            f"Window result: truck={result.get('truck_id')} "
            f"window={result.get('window_start')} "
            f"avg={result.get('average')}°C "
            f"count={result.get('count')}"
        )
        window_manager.completed_windows.append(result)
        return result

    op.inspect("output_log", results, lambda r: _output_result(r))

    return flow


# ============================================================
# Standalone Stream Processor (non-Bytewax fallback)
# ============================================================


class StreamProcessor:
    """
    Standalone stream processor that uses the TruckWindowManager
    for windowed aggregation. Used when Bytewax is not running
    as a separate dataflow (e.g., consuming from Kafka directly).
    """

    def __init__(self, manager: Optional[TruckWindowManager] = None):
        self.manager = manager or window_manager

    def process_event(self, data: dict) -> Optional[dict]:
        """Process a single event through the window manager."""
        return self.manager.process_event(data)

    def get_summary(self, truck_id: str) -> Optional[dict]:
        """Get current window summaries for a truck."""
        summaries = self.manager.get_all_summaries()
        return summaries.get(truck_id)


# Global processor instance for backward compatibility
stream_processor = StreamProcessor()


def run_stream_processor(max_messages: Optional[int] = None) -> int:
    """
    Run stream processor over incoming Kafka telemetry messages.
    Uses the window manager for 5-minute tumbling window aggregation.

    This is the fallback path when Bytewax is not running as a
    separate dataflow process.
    """
    from app.kafka.consumer import consume_messages

    logger.info("Stream processing worker started (standalone mode)...")

    # Restore state
    restored = window_manager.load_state()
    if restored:
        logger.info("Previous state restored successfully.")

    count = 0
    try:
        for message in consume_messages(max_messages=max_messages):
            result = window_manager.process_event(message)
            if result and result.get("status") not in ("duplicate", "late_rejected"):
                logger.info(
                    f"Processed: truck={result.get('truck_id')} | "
                    f"window={result.get('window')} | "
                    f"current={result.get('current')}°C | "
                    f"avg={result.get('average')}°C | "
                    f"count={result.get('count')}"
                )
            count += 1
            if max_messages and count >= max_messages:
                break
    except KeyboardInterrupt:
        logger.info("Stream processor interrupted.")
    finally:
        # Persist state on shutdown
        window_manager.save_state()
        logger.info(
            f"Stream processor stopped. "
            f"Processed {count} events. "
            f"Stats: {window_manager.stats}"
        )

    return count


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_stream_processor()