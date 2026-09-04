from kafka import KafkaConsumer
import json

consumer = KafkaConsumer(
    "truck-temperature",
    bootstrap_servers="localhost:9092",
    auto_offset_reset="earliest",
    group_id="streamforge",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

print("Consumer Started...")

for message in consumer:

    print(message.value)