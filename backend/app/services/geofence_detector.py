import math
from typing import Dict, Tuple, List, Optional
from sqlalchemy.orm import Session

from app.models.geofence import Geofence


# State dictionary tracking (truck_id, geofence_id) -> is_inside
_truck_geofence_state: Dict[Tuple[str, int], bool] = {}


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on the Earth
    in meters using the Haversine formula.
    """
    # Validation of coordinates
    if not (-90.0 <= lat1 <= 90.0 and -90.0 <= lat2 <= 90.0):
        return float("inf")
    if not (-180.0 <= lon1 <= 180.0 and -180.0 <= lon2 <= 180.0):
        return float("inf")

    earth_radius_meters = 6371000.0

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return earth_radius_meters * c


def reset_geofence_state():
    """Clear cached state, useful in test fixtures."""
    _truck_geofence_state.clear()


def check_truck_geofences(
    db: Session,
    truck_id: str,
    latitude: Optional[float],
    longitude: Optional[float],
) -> List[dict]:
    """
    Check if a truck entered or exited any active geofences.
    Returns a list of event dictionaries for any state transitions.
    """
    if latitude is None or longitude is None:
        return []

    events = []
    active_geofences = db.query(Geofence).filter(Geofence.active.is_(True)).all()

    for fence in active_geofences:
        radius = fence.radius or 1000.0  # default 1km if radius unspecified
        dist = haversine_distance(latitude, longitude, fence.latitude, fence.longitude)

        is_currently_inside = dist <= radius
        state_key = (truck_id, fence.id)

        previous_state = _truck_geofence_state.get(state_key)

        if previous_state is None:
            # Initialize without false trigger, or trigger enter if already inside
            _truck_geofence_state[state_key] = is_currently_inside
            if is_currently_inside:
                events.append({
                    "event_type": "geofence_enter",
                    "truck_id": truck_id,
                    "geofence_id": fence.id,
                    "geofence_name": fence.name,
                    "distance": round(dist, 1),
                    "radius": radius,
                    "message": f"Truck {truck_id} entered geofence '{fence.name}' ({round(dist, 1)}m from center).",
                })
        elif previous_state is False and is_currently_inside is True:
            # Enter event
            _truck_geofence_state[state_key] = True
            events.append({
                "event_type": "geofence_enter",
                "truck_id": truck_id,
                "geofence_id": fence.id,
                "geofence_name": fence.name,
                "distance": round(dist, 1),
                "radius": radius,
                "message": f"Truck {truck_id} entered geofence '{fence.name}' ({round(dist, 1)}m from center).",
            })
        elif previous_state is True and is_currently_inside is False:
            # Exit event
            _truck_geofence_state[state_key] = False
            events.append({
                "event_type": "geofence_exit",
                "truck_id": truck_id,
                "geofence_id": fence.id,
                "geofence_name": fence.name,
                "distance": round(dist, 1),
                "radius": radius,
                "message": f"Truck {truck_id} exited geofence '{fence.name}' ({round(dist, 1)}m from center).",
            })

    return events
