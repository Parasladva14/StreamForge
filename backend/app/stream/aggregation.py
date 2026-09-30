"""
StreamForge 5-Minute Tumbling Window Temperature Aggregation

This module implements the core stream processing logic using Bytewax.
It provides:
- 5-minute tumbling window aggregation per truck
- Event-time processing via EventClock
- Late event handling (configurable allowed lateness)
- Duplicate event detection
- Persistent state via JSON changelog

Window Type: Tumbling (non-overlapping, fixed-size 5-minute windows)
"""

import json
import logging
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

logger = logging.getLogger(__name__)

# ============================================================
# Configuration
# ============================================================

WINDOW_SIZE = timedelta(minutes=5)
ALLOWED_LATENESS = timedelta(minutes=2)
STATE_DIR = Path(os.getenv("STREAMFORGE_STATE_DIR", "data/stream_state"))

# ============================================================
# Window Aggregation State
# ============================================================


@dataclass
class WindowAggState:
    """Accumulator for a single truck's temperature readings within a window."""

    count: int = 0
    total: float = 0.0
    min_temp: float = float("inf")
    max_temp: float = float("-inf")
    first_event_time: Optional[str] = None
    last_event_time: Optional[str] = None
    seen_event_ids: list = field(default_factory=list)

    def merge(self, temperature: float, event_time: str, event_id: Optional[str] = None) -> bool:
        """
        Add a temperature reading to this window.
        Returns False if event_id is a duplicate.
        """
        if event_id and event_id in self.seen_event_ids:
            return False  # duplicate

        self.count += 1
        self.total += temperature
        if temperature < self.min_temp:
            self.min_temp = temperature
        if temperature > self.max_temp:
            self.max_temp = temperature
        if self.first_event_time is None or event_time < self.first_event_time:
            self.first_event_time = event_time
        if self.last_event_time is None or event_time > self.last_event_time:
            self.last_event_time = event_time
        if event_id:
            self.seen_event_ids.append(event_id)
            # Keep only last 500 IDs to bound memory
            if len(self.seen_event_ids) > 500:
                self.seen_event_ids = self.seen_event_ids[-250:]
        return True

    @property
    def average(self) -> float:
        if self.count == 0:
            return 0.0
        return round(self.total / self.count, 2)

    def summary(self) -> dict:
        return {
            "count": self.count,
            "average": self.average,
            "min": self.min_temp if self.count > 0 else 0.0,
            "max": self.max_temp if self.count > 0 else 0.0,
            "first_event_time": self.first_event_time,
            "last_event_time": self.last_event_time,
        }


# ============================================================
# Window Manager (per-truck windowed aggregation)
# ============================================================


def _window_key(event_time_dt: datetime) -> str:
    """Compute the tumbling window key for a given event time.

    Example: event at 10:03:27 → window '2026-09-30T10:00:00'
    """
    minutes = (event_time_dt.minute // 5) * 5
    window_start = event_time_dt.replace(minute=minutes, second=0, microsecond=0)
    return window_start.isoformat()


def _parse_event_time(ts_str: str) -> Optional[datetime]:
    """Parse an ISO format timestamp, handling various formats."""
    if not ts_str:
        return None
    try:
        dt = datetime.fromisoformat(ts_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except (ValueError, TypeError):
        return None


class TruckWindowManager:
    """
    Manages per-truck 5-minute tumbling windows with:
    - Event-time windowing
    - Late event handling (within allowed lateness)
    - Duplicate detection
    - State persistence via JSON
    """

    def __init__(self, state_dir: Optional[Path] = None):
        # truck_id -> { window_key -> WindowAggState }
        self.windows: dict[str, dict[str, WindowAggState]] = {}
        self.state_dir = state_dir or STATE_DIR
        self.completed_windows: list[dict] = []
        self._watermark: Optional[datetime] = None
        self.stats = {
            "events_processed": 0,
            "events_duplicated": 0,
            "events_late_accepted": 0,
            "events_late_rejected": 0,
            "windows_completed": 0,
        }

    def process_event(self, event: dict) -> Optional[dict]:
        """
        Process a single temperature telemetry event.

        Returns a window result dict if the event triggered a window completion,
        otherwise returns the current incremental state.
        """
        truck_id = event.get("truck_id")
        temperature = event.get("temperature")
        timestamp_str = event.get("timestamp")
        event_id = event.get("event_id")  # optional dedup field

        if not truck_id or temperature is None:
            logger.warning(f"Invalid event (missing truck_id or temperature): {event}")
            return None

        try:
            temperature = float(temperature)
        except (ValueError, TypeError):
            logger.warning(f"Invalid temperature value: {temperature}")
            return None

        # Parse event time
        event_time = _parse_event_time(timestamp_str)
        if event_time is None:
            event_time = datetime.now(timezone.utc)
            timestamp_str = event_time.isoformat()

        # Update watermark
        if self._watermark is None or event_time > self._watermark:
            self._watermark = event_time

        # Determine window
        wkey = _window_key(event_time)

        # Check for late events
        window_start = _parse_event_time(wkey)
        window_end = window_start + WINDOW_SIZE
        is_late = False

        if self._watermark and window_end < self._watermark - ALLOWED_LATENESS:
            # Event is too late — beyond allowed lateness
            self.stats["events_late_rejected"] += 1
            logger.debug(
                f"Late event rejected: truck={truck_id}, "
                f"event_time={timestamp_str}, window={wkey}, "
                f"watermark={self._watermark.isoformat()}"
            )
            return {
                "truck_id": truck_id,
                "window": wkey,
                "status": "late_rejected",
                "event_time": timestamp_str,
            }
        elif self._watermark and window_end < self._watermark:
            is_late = True
            self.stats["events_late_accepted"] += 1

        # Get or create window state
        if truck_id not in self.windows:
            self.windows[truck_id] = {}
        if wkey not in self.windows[truck_id]:
            self.windows[truck_id][wkey] = WindowAggState()

        agg = self.windows[truck_id][wkey]
        accepted = agg.merge(temperature, timestamp_str, event_id)

        if not accepted:
            self.stats["events_duplicated"] += 1
            return {
                "truck_id": truck_id,
                "window": wkey,
                "status": "duplicate",
                "event_time": timestamp_str,
            }

        self.stats["events_processed"] += 1

        # Check if any windows should be completed
        completed = self._check_window_completions(truck_id)

        result = {
            "truck_id": truck_id,
            "window": wkey,
            "status": "late_accepted" if is_late else "accepted",
            "current": temperature,
            **agg.summary(),
        }

        if completed:
            result["completed_windows"] = completed

        return result

    def _check_window_completions(self, truck_id: str) -> list[dict]:
        """Check and emit any windows that are now past the watermark + lateness."""
        if self._watermark is None:
            return []

        completed = []
        cutoff = self._watermark - ALLOWED_LATENESS

        if truck_id not in self.windows:
            return []

        expired_keys = []
        for wkey, agg in self.windows[truck_id].items():
            window_start = _parse_event_time(wkey)
            window_end = window_start + WINDOW_SIZE
            if window_end <= cutoff and agg.count > 0:
                result = {
                    "truck_id": truck_id,
                    "window_start": wkey,
                    "window_end": window_end.isoformat(),
                    "window_type": "tumbling_5min",
                    **agg.summary(),
                }
                completed.append(result)
                self.completed_windows.append(result)
                self.stats["windows_completed"] += 1
                expired_keys.append(wkey)

        for wkey in expired_keys:
            del self.windows[truck_id][wkey]

        return completed

    def get_all_summaries(self) -> dict:
        """Get current state of all active windows."""
        result = {}
        for truck_id, truck_windows in self.windows.items():
            result[truck_id] = {}
            for wkey, agg in truck_windows.items():
                result[truck_id][wkey] = agg.summary()
        return result

    # ============================================================
    # State Persistence
    # ============================================================

    def save_state(self):
        """Save current window state to JSON file for recovery."""
        self.state_dir.mkdir(parents=True, exist_ok=True)
        state_file = self.state_dir / "window_state.json"

        state = {
            "watermark": self._watermark.isoformat() if self._watermark else None,
            "stats": self.stats,
            "windows": {},
        }

        for truck_id, truck_windows in self.windows.items():
            state["windows"][truck_id] = {}
            for wkey, agg in truck_windows.items():
                state["windows"][truck_id][wkey] = asdict(agg)

        with open(state_file, "w") as f:
            json.dump(state, f, indent=2)
        logger.info(f"State saved to {state_file}")

    def load_state(self) -> bool:
        """Load window state from JSON file. Returns True if state was restored."""
        state_file = self.state_dir / "window_state.json"
        if not state_file.exists():
            return False

        try:
            with open(state_file, "r") as f:
                state = json.load(f)

            watermark_str = state.get("watermark")
            if watermark_str:
                self._watermark = _parse_event_time(watermark_str)

            self.stats = state.get("stats", self.stats)

            for truck_id, truck_windows in state.get("windows", {}).items():
                self.windows[truck_id] = {}
                for wkey, agg_data in truck_windows.items():
                    agg = WindowAggState(
                        count=agg_data.get("count", 0),
                        total=agg_data.get("total", 0.0),
                        min_temp=agg_data.get("min_temp", float("inf")),
                        max_temp=agg_data.get("max_temp", float("-inf")),
                        first_event_time=agg_data.get("first_event_time"),
                        last_event_time=agg_data.get("last_event_time"),
                        seen_event_ids=agg_data.get("seen_event_ids", []),
                    )
                    self.windows[truck_id][wkey] = agg

            logger.info(
                f"State restored from {state_file}: "
                f"{sum(len(w) for w in self.windows.values())} active windows, "
                f"{self.stats['events_processed']} events processed previously"
            )
            return True
        except Exception as e:
            logger.error(f"Failed to load state: {e}")
            return False

    def clear_state(self):
        """Clear persisted state file."""
        state_file = self.state_dir / "window_state.json"
        if state_file.exists():
            state_file.unlink()
            logger.info(f"State file removed: {state_file}")


# Global instance used by the stream worker
window_manager = TruckWindowManager()