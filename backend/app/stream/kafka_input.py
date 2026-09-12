from app.kafka.consumer import get_kafka_consumer

def get_stream_consumer():
    return get_kafka_consumer(topic="truck-temperature", group_id="streamforge-analytics")