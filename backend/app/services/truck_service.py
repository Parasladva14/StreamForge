from sqlalchemy.orm import Session

from app.models.truck import Truck
from app.schemas.truck_schema import TruckCreate, TruckUpdate

CITY_COORDINATES = {
    "mumbai": (19.0760, 72.8777),
    "delhi": (28.6139, 77.2090),
    "new delhi": (28.6139, 77.2090),
    "bengaluru": (12.9716, 77.5946),
    "bangalore": (12.9716, 77.5946),
    "pune": (18.5204, 73.8567),
    "ahmedabad": (23.0225, 72.5714),
    "chennai": (13.0827, 80.2707),
    "kolkata": (22.5726, 88.3639),
    "hyderabad": (17.3850, 78.4867),
    "jaipur": (26.9124, 75.7873),
    "surat": (21.1702, 72.8311),
    "nagpur": (21.1458, 79.0882),
    "indore": (22.7196, 75.8577),
    "vapi": (20.3714, 72.9005),
    "vadodara": (22.3072, 73.1812),
    "rajkot": (22.3039, 70.8022),
    "lucknow": (26.8467, 80.9462),
    "kanpur": (26.4499, 80.3319),
    "bhopal": (23.2599, 77.4126),
    "patna": (25.6093, 85.1376),
    "ludhiana": (30.9010, 75.8573),
    "agra": (27.1767, 78.0081),
    "nashik": (20.0063, 73.7900),
    "varanasi": (25.3176, 82.9739),
    "goa": (15.2993, 74.1240),
    "panaji": (15.4909, 73.8278),
    "chandigarh": (30.7333, 76.7794),
    "coimbatore": (11.0168, 76.9558),
    "visakhapatnam": (17.6868, 83.2185),
    "kochi": (9.9312, 76.2673),
    "thiruvananthapuram": (8.5241, 76.9366),
    "guwahati": (26.1445, 91.7362),
    "ranchi": (23.3441, 85.3096),
    "raipur": (21.2514, 81.6296),
    "dehradun": (30.3165, 78.0322),
    "amritsar": (31.6340, 74.8723),
    "jodhpur": (26.2389, 73.0243),
    "udaipur": (24.5854, 73.7125),
    "mysuru": (12.2958, 76.6394),
    "mysore": (12.2958, 76.6394),
    "mangalore": (12.9141, 74.8560),
    "thane": (19.2183, 72.9781),
    "navi mumbai": (19.0330, 73.0297),
}


def resolve_coordinates(location: str, lat: float | None, lng: float | None):
    if lat is not None and lng is not None:
        return lat, lng
    loc_key = (location or "").strip().lower()
    for city, coords in CITY_COORDINATES.items():
        if city in loc_key:
            return coords[0], coords[1]
    # Default fallback
    return 19.0760, 72.8777


def create_truck(db: Session, data: TruckCreate):
    existing = db.query(Truck).filter(Truck.truck_id == data.truck_id).first()
    if existing:
        raise ValueError(f"Truck ID '{data.truck_id}' is already registered.")

    lat, lng = resolve_coordinates(data.location, data.latitude, data.longitude)

    truck = Truck(
        truck_id=data.truck_id,
        driver_name=data.driver_name,
        location=data.location,
        latitude=lat,
        longitude=lng,
        speed=data.speed if data.speed is not None else 50.0,
        fuel=data.fuel if data.fuel is not None else 85.0,
        temperature=data.temperature,
        status=data.status or "Active",
    )

    db.add(truck)
    db.commit()
    db.refresh(truck)

    return truck


def get_all_trucks(db: Session):
    return db.query(Truck).order_by(Truck.id.asc()).all()


def get_truck(db: Session, truck_id: int):
    return db.query(Truck).filter(Truck.id == truck_id).first()


def get_truck_by_truck_id(db: Session, truck_no: str):
    return db.query(Truck).filter(Truck.truck_id == truck_no).first()


def update_truck(db: Session, truck_id: int, data: TruckUpdate):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()

    if not truck:
        return None

    if data.driver_name is not None:
        truck.driver_name = data.driver_name
    if data.location is not None:
        truck.location = data.location
        if data.latitude is None and data.longitude is None:
            truck.latitude, truck.longitude = resolve_coordinates(data.location, None, None)
    if data.latitude is not None:
        truck.latitude = data.latitude
    if data.longitude is not None:
        truck.longitude = data.longitude
    if data.speed is not None:
        truck.speed = data.speed
    if data.fuel is not None:
        truck.fuel = data.fuel
    if data.temperature is not None:
        truck.temperature = data.temperature
    if data.status is not None:
        truck.status = data.status

    db.commit()
    db.refresh(truck)

    return truck


def delete_truck(db: Session, truck_id: int):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()

    if not truck:
        return None

    db.delete(truck)
    db.commit()

    return {
        "message": "Truck Deleted Successfully",
        "truck_id": truck_id,
    }