"""
StreamForge Stream Worker

Entry point for the stream processing pipeline.
Can run in two modes:

1. Bytewax mode (recommended):
   python -m bytewax.run app.stream.bytewax_flow:build_flow

2. Standalone mode (fallback):
   python -m app.workers.stream_worker

The standalone mode uses kafka-python consumer + TruckWindowManager
for 5-minute tumbling window aggregation with state persistence.
"""

import sys
import signal
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("streamforge.worker")


def main():
    """Run the stream processor in standalone mode."""
    from app.stream.bytewax_flow import run_stream_processor

    logger.info("🚀 StreamForge Stream Worker Starting (standalone mode)...")
    logger.info("   Window type: tumbling, 5 minutes")
    logger.info("   Late event tolerance: 2 minutes")
    logger.info("   State persistence: JSON (data/stream_state/)")
    logger.info("")
    logger.info("   For Bytewax mode, run:")
    logger.info("   python -m bytewax.run app.stream.bytewax_flow:build_flow")
    logger.info("")

    # Graceful shutdown
    def shutdown(sig, frame):
        logger.info("Shutdown signal received. Saving state...")
        from app.stream.aggregation import window_manager
        window_manager.save_state()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    run_stream_processor()


if __name__ == "__main__":
    main()