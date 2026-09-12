import json
import logging
from typing import Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

_producer = None
_kafka_available = None


def get_kafka_producer():
    global _producer, _kafka_available
    if _kafka_available is False:
        return None
    if _producer is not None:
        return _producer

    try:
        from kafka import KafkaProducer

        _producer = KafkaProducer(
            bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVER,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            request_timeout_ms=2000,
            max_block_ms=2000,
            retries=1,
        )
        _kafka_available = True
        logger.info(f"Connected to Kafka broker at {settings.KAFKA_BOOTSTRAP_SERVER}")
        return _producer
    except Exception as e:
        _kafka_available = False
        logger.warning(
            f"Kafka broker not reachable at {settings.KAFKA_BOOTSTRAP_SERVER}: {e}. Running in standalone mode."
        )
        return None


def send_temperature(data: dict) -> bool:
    """
    Send telemetry payload to Kafka. Fails gracefully if Kafka is not running.
    """
    try:
        producer = get_kafka_producer()
        if producer is None:
            return False

        topic = getattr(settings, "KAFKA_TOPIC_TEMPERATURE", "truck-temperature")
        producer.send(topic, value=data)
        producer.flush()
        return True
    except Exception as e:
        logger.warning(f"Failed to publish to Kafka: {e}")
        return False