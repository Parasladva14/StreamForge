import json
import logging
from typing import Optional, Generator
from app.config.settings import settings

logger = logging.getLogger(__name__)


def get_kafka_consumer(
    topic: Optional[str] = None,
    group_id: str = "streamforge",
    timeout_ms: int = 1000,
):
    """
    Safely initialize and return a Kafka consumer. Returns None if Kafka is not available.
    """
    topic_name = topic or getattr(settings, "KAFKA_TOPIC_TEMPERATURE", "truck-temperature")
    try:
        from kafka import KafkaConsumer

        consumer = KafkaConsumer(
            topic_name,
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVER,
            auto_offset_reset="earliest",
            group_id=group_id,
            consumer_timeout_ms=timeout_ms,
            value_deserializer=lambda x: json.loads(x.decode("utf-8")),
        )
        return consumer
    except Exception as e:
        logger.warning(f"Could not connect Kafka consumer to {settings.KAFKA_BOOTSTRAP_SERVER}: {e}")
        return None


def consume_messages(max_messages: Optional[int] = None) -> Generator[dict, None, None]:
    """
    Yield messages from the Kafka truck-temperature topic.
    """
    consumer = get_kafka_consumer()
    if not consumer:
        return

    count = 0
    try:
        for message in consumer:
            yield message.value
            count += 1
            if max_messages and count >= max_messages:
                break
    except Exception as e:
        logger.error(f"Error consuming Kafka messages: {e}")
    finally:
        try:
            consumer.close()
        except Exception:
            pass


if __name__ == "__main__":
    print("Starting StreamForge Kafka Consumer...")
    for msg in consume_messages():
        print("Received:", msg)