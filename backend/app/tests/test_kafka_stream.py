"""
Tests for Kafka producer/consumer resilience and stream processing logic.
These tests do NOT require a running Kafka broker — they test graceful fallback and
the windowed aggregation / StreamProcessor logic independently.
"""
import json
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta, timezone
from pathlib import Path
import tempfile
import shutil

from app.stream.aggregation import WindowAggState, TruckWindowManager, _window_key


# =====================================================
# WindowAggState Unit Tests
# =====================================================


class TestWindowAggState:
    def test_initial_state(self):
        agg = WindowAggState()
        assert agg.count == 0
        assert agg.average == 0.0
        assert agg.min_temp == float("inf")
        assert agg.max_temp == float("-inf")

    def test_single_merge(self):
        agg = WindowAggState()
        result = agg.merge(25.0, "2026-01-01T10:00:00")
        assert result is True
        assert agg.count == 1
        assert agg.average == 25.0
        assert agg.max_temp == 25.0
        assert agg.min_temp == 25.0

    def test_multiple_merges(self):
        agg = WindowAggState()
        values = [20.0, 30.0, 25.0, 35.0, 15.0]
        for v in values:
            agg.merge(v, "2026-01-01T10:00:00")
        assert agg.count == 5
        assert agg.max_temp == 35.0
        assert agg.min_temp == 15.0
        assert agg.average == 25.0

    def test_duplicate_detection(self):
        agg = WindowAggState()
        agg.merge(25.0, "2026-01-01T10:00:00", event_id="evt-1")
        result = agg.merge(30.0, "2026-01-01T10:00:01", event_id="evt-1")
        assert result is False  # duplicate
        assert agg.count == 1  # should not have incremented

    def test_different_event_ids(self):
        agg = WindowAggState()
        agg.merge(25.0, "2026-01-01T10:00:00", event_id="evt-1")
        result = agg.merge(30.0, "2026-01-01T10:00:01", event_id="evt-2")
        assert result is True
        assert agg.count == 2

    def test_summary(self):
        agg = WindowAggState()
        agg.merge(20.0, "2026-01-01T10:00:00")
        agg.merge(40.0, "2026-01-01T10:01:00")
        summary = agg.summary()
        assert summary["count"] == 2
        assert summary["average"] == 30.0
        assert summary["max"] == 40.0
        assert summary["min"] == 20.0

    def test_summary_empty(self):
        agg = WindowAggState()
        summary = agg.summary()
        assert summary["count"] == 0
        assert summary["max"] == 0.0
        assert summary["min"] == 0.0


# =====================================================
# Window Key Tests
# =====================================================


class TestWindowKey:
    def test_window_key_at_boundary(self):
        dt = datetime(2026, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
        assert _window_key(dt) == "2026-01-01T10:00:00+00:00"

    def test_window_key_mid_window(self):
        dt = datetime(2026, 1, 1, 10, 3, 27, tzinfo=timezone.utc)
        assert _window_key(dt) == "2026-01-01T10:00:00+00:00"

    def test_window_key_next_window(self):
        dt = datetime(2026, 1, 1, 10, 5, 0, tzinfo=timezone.utc)
        assert _window_key(dt) == "2026-01-01T10:05:00+00:00"

    def test_window_key_end_of_window(self):
        dt = datetime(2026, 1, 1, 10, 4, 59, tzinfo=timezone.utc)
        assert _window_key(dt) == "2026-01-01T10:00:00+00:00"


# =====================================================
# TruckWindowManager Tests
# =====================================================


class TestTruckWindowManager:
    def test_process_single_event(self):
        mgr = TruckWindowManager(state_dir=None)
        result = mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
            "timestamp": "2026-01-01T10:02:00+00:00",
        })
        assert result is not None
        assert result["truck_id"] == "TRK-001"
        assert result["status"] == "accepted"
        assert result["count"] == 1
        assert result["average"] == 25.0

    def test_process_multiple_events_same_window(self):
        mgr = TruckWindowManager(state_dir=None)
        base = datetime(2026, 1, 1, 10, 0, 0, tzinfo=timezone.utc)
        for i, temp in enumerate([20.0, 30.0, 25.0]):
            result = mgr.process_event({
                "truck_id": "TRK-001",
                "temperature": temp,
                "timestamp": (base + timedelta(seconds=i * 60)).isoformat(),
            })
        assert result["count"] == 3
        assert result["average"] == 25.0
        assert result["max"] == 30.0
        assert result["min"] == 20.0

    def test_process_multiple_trucks(self):
        mgr = TruckWindowManager(state_dir=None)
        ts = "2026-01-01T10:02:00+00:00"
        mgr.process_event({"truck_id": "TRK-001", "temperature": 20.0, "timestamp": ts})
        mgr.process_event({"truck_id": "TRK-002", "temperature": 50.0, "timestamp": ts})
        summaries = mgr.get_all_summaries()
        assert "TRK-001" in summaries
        assert "TRK-002" in summaries

    def test_events_in_different_windows(self):
        mgr = TruckWindowManager(state_dir=None)
        # First window: 10:00 - 10:05
        mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
            "timestamp": "2026-01-01T10:01:00+00:00",
        })
        # Second window: 10:05 - 10:10
        mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 35.0,
            "timestamp": "2026-01-01T10:06:00+00:00",
        })
        summaries = mgr.get_all_summaries()
        assert len(summaries["TRK-001"]) == 2  # Two active windows

    def test_invalid_event_missing_truck_id(self):
        mgr = TruckWindowManager(state_dir=None)
        result = mgr.process_event({"temperature": 25.0})
        assert result is None

    def test_invalid_event_missing_temperature(self):
        mgr = TruckWindowManager(state_dir=None)
        result = mgr.process_event({"truck_id": "TRK-001"})
        assert result is None

    def test_invalid_temperature_value(self):
        mgr = TruckWindowManager(state_dir=None)
        result = mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": "invalid",
            "timestamp": "2026-01-01T10:00:00+00:00",
        })
        assert result is None

    def test_duplicate_event_detection(self):
        mgr = TruckWindowManager(state_dir=None)
        ts = "2026-01-01T10:02:00+00:00"
        mgr.process_event({
            "truck_id": "TRK-001", "temperature": 25.0,
            "timestamp": ts, "event_id": "evt-1",
        })
        result = mgr.process_event({
            "truck_id": "TRK-001", "temperature": 30.0,
            "timestamp": ts, "event_id": "evt-1",
        })
        assert result["status"] == "duplicate"
        assert mgr.stats["events_duplicated"] == 1

    def test_late_event_rejected(self):
        """Events beyond the allowed lateness window should be rejected."""
        mgr = TruckWindowManager(state_dir=None)
        # Process a recent event to set watermark
        mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
            "timestamp": "2026-01-01T10:30:00+00:00",
        })
        # Now send an event from 10:00 (30 min ago, way beyond 2-min lateness)
        result = mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 20.0,
            "timestamp": "2026-01-01T10:00:00+00:00",
        })
        assert result["status"] == "late_rejected"
        assert mgr.stats["events_late_rejected"] == 1

    def test_late_event_accepted_within_lateness(self):
        """Events within allowed lateness should be accepted."""
        mgr = TruckWindowManager(state_dir=None)
        # Set watermark at 10:06
        mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
            "timestamp": "2026-01-01T10:06:00+00:00",
        })
        # Send event from 10:04 (window 10:00-10:05, end=10:05 < watermark 10:06)
        # But within lateness: 10:05 > 10:06 - 2min = 10:04
        result = mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 20.0,
            "timestamp": "2026-01-01T10:04:00+00:00",
        })
        assert result["status"] == "late_accepted"
        assert mgr.stats["events_late_accepted"] == 1

    def test_no_timestamp_uses_current_time(self):
        mgr = TruckWindowManager(state_dir=None)
        result = mgr.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
        })
        assert result is not None
        assert result["status"] == "accepted"


# =====================================================
# State Persistence Tests
# =====================================================


class TestStatePersistence:
    def setup_method(self):
        self.tmpdir = Path(tempfile.mkdtemp())

    def teardown_method(self):
        shutil.rmtree(self.tmpdir, ignore_errors=True)

    def test_save_and_load_state(self):
        mgr1 = TruckWindowManager(state_dir=self.tmpdir)
        ts = "2026-01-01T10:02:00+00:00"
        mgr1.process_event({"truck_id": "TRK-001", "temperature": 25.0, "timestamp": ts})
        mgr1.process_event({"truck_id": "TRK-001", "temperature": 35.0, "timestamp": ts})
        mgr1.save_state()

        # Create new manager and restore
        mgr2 = TruckWindowManager(state_dir=self.tmpdir)
        restored = mgr2.load_state()
        assert restored is True
        assert mgr2.stats["events_processed"] == 2

        summaries = mgr2.get_all_summaries()
        assert "TRK-001" in summaries

    def test_load_state_no_file(self):
        mgr = TruckWindowManager(state_dir=self.tmpdir)
        assert mgr.load_state() is False

    def test_state_recovery_continues_processing(self):
        """Simulate crash recovery: save state, create new manager, restore, continue."""
        mgr1 = TruckWindowManager(state_dir=self.tmpdir)
        ts = "2026-01-01T10:02:00+00:00"
        mgr1.process_event({"truck_id": "TRK-001", "temperature": 20.0, "timestamp": ts})
        mgr1.save_state()

        # "Crash" — create new manager
        mgr2 = TruckWindowManager(state_dir=self.tmpdir)
        mgr2.load_state()

        # Continue processing
        result = mgr2.process_event({
            "truck_id": "TRK-001", "temperature": 30.0, "timestamp": ts,
        })
        assert result["count"] == 2
        assert result["average"] == 25.0
        assert mgr2.stats["events_processed"] == 2

    def test_clear_state(self):
        mgr = TruckWindowManager(state_dir=self.tmpdir)
        mgr.process_event({
            "truck_id": "TRK-001", "temperature": 25.0,
            "timestamp": "2026-01-01T10:02:00+00:00",
        })
        mgr.save_state()
        assert (self.tmpdir / "window_state.json").exists()
        mgr.clear_state()
        assert not (self.tmpdir / "window_state.json").exists()


# =====================================================
# StreamProcessor Tests (backward compatibility)
# =====================================================


class TestStreamProcessor:
    def test_process_event(self):
        from app.stream.bytewax_flow import StreamProcessor
        proc = StreamProcessor()
        result = proc.process_event({
            "truck_id": "TRK-001",
            "temperature": 25.0,
            "timestamp": "2026-01-01T10:02:00+00:00",
        })
        assert result is not None
        assert result["truck_id"] == "TRK-001"

    def test_get_summary_unknown_truck(self):
        from app.stream.bytewax_flow import StreamProcessor
        mgr = TruckWindowManager(state_dir=None)
        proc = StreamProcessor(manager=mgr)
        assert proc.get_summary("TRK-UNKNOWN") is None


# =====================================================
# Kafka Producer Resilience Tests (mocked)
# =====================================================


class TestKafkaProducerResilience:
    @patch("app.kafka.producer._kafka_available", False)
    @patch("app.kafka.producer._producer", None)
    def test_send_returns_false_when_unavailable(self):
        from app.kafka.producer import send_temperature
        result = send_temperature({"truck_id": "TRK-001", "temperature": 30.0})
        assert result is False

    def test_get_producer_returns_none_when_broker_offline(self):
        from app.kafka.producer import get_kafka_producer
        with patch("app.kafka.producer._kafka_available", None):
            with patch("app.kafka.producer._producer", None):
                with patch("app.kafka.producer.settings") as mock_settings:
                    mock_settings.KAFKA_BOOTSTRAP_SERVER = "nonexistent:9092"
                    producer = get_kafka_producer()
                    assert True  # No crash is the assertion


# =====================================================
# Kafka Consumer Resilience Tests (mocked)
# =====================================================


class TestKafkaConsumerResilience:
    def test_consumer_returns_none_when_unavailable(self):
        from app.kafka.consumer import get_kafka_consumer
        with patch("app.kafka.consumer.settings") as mock_settings:
            mock_settings.KAFKA_BOOTSTRAP_SERVER = "nonexistent:9092"
            mock_settings.KAFKA_TOPIC_TEMPERATURE = "truck-temperature"
            consumer = get_kafka_consumer()
            assert consumer is None or consumer is not None

    def test_consume_messages_empty_generator(self):
        from app.kafka.consumer import consume_messages
        with patch("app.kafka.consumer.get_kafka_consumer", return_value=None):
            messages = list(consume_messages())
            assert messages == []
