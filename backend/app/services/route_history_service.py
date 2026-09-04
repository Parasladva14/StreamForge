from datetime import datetime, timedelta
import random


def get_route_history(truck_id):
    route = []

    lat = 19.0760
    lng = 72.8777

    for i in range(30):
        route.append({
            "latitude": lat + i * 0.001,
            "longitude": lng + i * 0.001,
            "speed": random.randint(30, 80),
            "timestamp": (
                datetime.now() -
                timedelta(minutes=30-i)
            ).isoformat()
        })

    return route