from datetime import datetime, timedelta
import random
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.truck import Truck
from app.services.truck_service import resolve_coordinates


def get_route_history(truck_id: str, db: Optional[Session] = None) -> List[dict]:
    """
    Generate realistic historical telemetry route for a truck based on its actual location.
    """
    lat, lng = 19.0760, 72.8777

    if db is not None:
        truck = (
            db.query(Truck)
            .filter((Truck.truck_id == truck_id) | (Truck.id == truck_id if str(truck_id).isdigit() else False))
            .first()
        )
        if truck:
            lat, lng = resolve_coordinates(truck.location, truck.latitude, truck.longitude)

    route = []
    # Generate 30 sequential route waypoints along a realistic transit trajectory
    now = datetime.utcnow()
    heading_lat = random.choice([0.0008, -0.0008, 0.0012])
    heading_lng = random.choice([0.0008, 0.0012, -0.0008])

    for i in range(30):
        # Curve the route gently
        jitter_lat = random.uniform(-0.0002, 0.0002)
        jitter_lng = random.uniform(-0.0002, 0.0002)
        point_lat = round(lat + (i * heading_lat) + jitter_lat, 5)
        point_lng = round(lng + (i * heading_lng) + jitter_lng, 5)
        point_speed = random.randint(45, 78) if i > 2 and i < 28 else random.randint(15, 35)

        route.append({
            "latitude": point_lat,
            "longitude": point_lng,
            "speed": point_speed,
            "fuel": round(max(20.0, 95.0 - (i * 0.4)), 1),
            "temperature": round(26.0 + (i * 0.15) + random.uniform(-0.5, 0.5), 1),
            "timestamp": (now - timedelta(minutes=30 - i)).isoformat(),
        })

    return route