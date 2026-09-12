from collections import defaultdict
import logging
from typing import Optional, Dict
from app.stream.aggregation import TemperatureAggregator
from app.kafka.consumer import consume_messages

logger = logging.getLogger(__name__)


class StreamProcessor:
    def __init__(self):
        self.aggregators: Dict[str, TemperatureAggregator] = defaultdict(TemperatureAggregator)

    def process_event(self, data: dict) -> dict:
        truck_id = data.get("truck_id")
        temperature = float(data.get("temperature", 0.0))

        agg = self.aggregators[truck_id]
        agg.update(temperature)

        return {
            "truck_id": truck_id,
            "current": temperature,
            "average": agg.average,
            "max": agg.max_temperature,
            "min": agg.min_temperature,
            "is_critical": agg.is_critical,
            "is_warning": agg.is_warning,
        }

    def get_summary(self, truck_id: str) -> Optional[dict]:
        if truck_id in self.aggregators:
            return self.aggregators[truck_id].summary()
        return None


# Global processor instance for stream analytics
stream_processor = StreamProcessor()


def run_stream_processor(max_messages: Optional[int] = None):
    """
    Run stream processor over incoming Kafka telemetry messages.
    """
    logger.info("Stream processing worker started...")
    count = 0
    for message in consume_messages(max_messages=max_messages):
        result = stream_processor.process_event(message)
        logger.info(
            f"Processed telemetry -> Truck: {result['truck_id']} | "
            f"Current: {result['current']}°C | "
            f"Average: {result['average']}°C"
        )
        count += 1
        if max_messages and count >= max_messages:
            break
    return count


if __name__ == "__main__":
    run_stream_processor()