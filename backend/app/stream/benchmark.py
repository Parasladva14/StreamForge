"""
StreamForge Performance Benchmark

Measures stream processing throughput by generating synthetic
temperature events and processing them through the windowed aggregator.

Usage:
    cd backend
    python -m app.stream.benchmark

Results include:
- Total events processed
- Processing time
- Events per second
- Window completions
- Late/duplicate event handling
"""

import time
import random
import logging
from datetime import datetime, timedelta, timezone

from app.stream.aggregation import TruckWindowManager

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger("benchmark")


def generate_events(
    num_events: int = 100_000,
    num_trucks: int = 50,
    time_span_minutes: int = 60,
) -> list[dict]:
    """Generate synthetic temperature telemetry events."""
    events = []
    base_time = datetime.now(timezone.utc) - timedelta(minutes=time_span_minutes)
    truck_ids = [f"TRK-{i:04d}" for i in range(1, num_trucks + 1)]

    for i in range(num_events):
        truck_id = random.choice(truck_ids)
        # Time progresses roughly linearly with some jitter
        event_time = base_time + timedelta(
            seconds=(i / num_events) * time_span_minutes * 60
            + random.uniform(-5, 5)
        )
        temperature = round(random.uniform(10.0, 65.0), 1)

        events.append({
            "truck_id": truck_id,
            "temperature": temperature,
            "timestamp": event_time.isoformat(),
            "event_id": f"evt-{i}",
            "speed": random.randint(0, 120),
            "location": f"Location-{random.randint(1, 20)}",
        })

    return events


def run_benchmark(
    num_events: int = 100_000,
    num_trucks: int = 50,
    include_duplicates: bool = True,
    include_late: bool = True,
):
    """Run the performance benchmark."""
    print("=" * 60)
    print("StreamForge Stream Processing Benchmark")
    print("=" * 60)
    print(f"Events to generate: {num_events:,}")
    print(f"Trucks: {num_trucks}")
    print(f"Include duplicates: {include_duplicates}")
    print(f"Include late events: {include_late}")
    print()

    # Generate events
    print("Generating events...", end=" ", flush=True)
    gen_start = time.perf_counter()
    events = generate_events(num_events, num_trucks)

    # Add some duplicates
    if include_duplicates:
        num_dupes = num_events // 100  # 1%
        for _ in range(num_dupes):
            events.append(random.choice(events[:num_events]))
        random.shuffle(events)

    # Add some late events
    if include_late:
        num_late = num_events // 50  # 2%
        # Generate events that are 3-10 minutes late (some within allowed lateness)
        latest_event_time = datetime.fromisoformat(events[-1]["timestamp"])
        for i in range(num_late):
            late_offset = timedelta(minutes=random.uniform(1, 10))
            late_time = latest_event_time - late_offset
            events.append({
                "truck_id": f"TRK-{random.randint(1, num_trucks):04d}",
                "temperature": round(random.uniform(10.0, 65.0), 1),
                "timestamp": late_time.isoformat(),
                "event_id": f"late-{i}",
            })

    gen_elapsed = time.perf_counter() - gen_start
    total_events = len(events)
    print(f"done ({total_events:,} events in {gen_elapsed:.2f}s)")
    print()

    # Process events
    manager = TruckWindowManager(state_dir=None)
    print("Processing events...", end=" ", flush=True)

    start = time.perf_counter()
    results = []
    for event in events:
        result = manager.process_event(event)
        if result:
            results.append(result)
    elapsed = time.perf_counter() - start

    events_per_sec = total_events / elapsed if elapsed > 0 else 0
    avg_latency_us = (elapsed / total_events) * 1_000_000 if total_events > 0 else 0

    # Print results
    print(f"done")
    print()
    print("-" * 60)
    print("RESULTS")
    print("-" * 60)
    print(f"Total events:          {total_events:,}")
    print(f"Processing time:       {elapsed:.3f}s")
    print(f"Events/sec:            {events_per_sec:,.0f}")
    print(f"Avg latency/event:     {avg_latency_us:.1f} µs")
    print()
    print(f"Events processed:      {manager.stats['events_processed']:,}")
    print(f"Duplicates detected:   {manager.stats['events_duplicated']:,}")
    print(f"Late accepted:         {manager.stats['events_late_accepted']:,}")
    print(f"Late rejected:         {manager.stats['events_late_rejected']:,}")
    print(f"Windows completed:     {manager.stats['windows_completed']:,}")
    print()
    print(f"Active windows:        {sum(len(w) for w in manager.windows.values()):,}")
    print(f"Trucks tracked:        {len(manager.windows):,}")
    print("-" * 60)

    # Save state to demonstrate persistence
    if manager.state_dir:
        manager.save_state()
        print(f"State saved to: {manager.state_dir}")

    target = 100_000
    if events_per_sec >= target:
        print(f"\nPASSED: {events_per_sec:,.0f} events/sec >= {target:,} target")
    else:
        pct = (events_per_sec / target) * 100
        print(f"\n{events_per_sec:,.0f} events/sec ({pct:.0f}% of {target:,} target)")
        print("   Note: This is a single-threaded local benchmark.")
        print("   Production throughput scales with partitions + workers.")

    return {
        "total_events": total_events,
        "processing_time_sec": round(elapsed, 3),
        "events_per_sec": round(events_per_sec),
        "avg_latency_us": round(avg_latency_us, 1),
        "stats": manager.stats,
    }


if __name__ == "__main__":
    run_benchmark()
