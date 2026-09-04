from collections import defaultdict

from app.stream.aggregation import TemperatureAggregator
from app.stream.kafka_input import consumer

aggregators = defaultdict(TemperatureAggregator)

print("Stream processing started...")

for message in consumer:
    data = message.value

    truck_id = data["truck_id"]
    temperature = data["temperature"]

    agg = aggregators[truck_id]
    agg.update(temperature)

    print(
        f"Truck: {truck_id} | "
        f"Current: {temperature}°C | "
        f"Average: {agg.average}°C"
    )