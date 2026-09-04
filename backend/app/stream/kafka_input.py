from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "truck-temperature",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    value_deserializer=lambda x: json.loads(x.decode())
)