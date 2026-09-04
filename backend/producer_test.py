from app.kafka.producer import send_temperature

import random

while True:

    data = {

        "truck_id": random.randint(1000, 9999),

        "location": "Mumbai",

        "temperature": random.randint(20, 45)

    }

    send_temperature(data)

    print(data)

    input("Press Enter...")