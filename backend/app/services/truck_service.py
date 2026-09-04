from sqlalchemy.orm import Session

from app.models.truck import Truck
from app.schemas.truck_schema import TruckCreate, TruckUpdate


def create_truck(db: Session, data: TruckCreate):
    truck = Truck(
        truck_id=data.truck_id,
        driver_name=data.driver_name,
        location=data.location,
        temperature=data.temperature,
        status=data.status,
    )

    db.add(truck)
    db.commit()
    db.refresh(truck)

    return truck


def get_all_trucks(db: Session):
    return db.query(Truck).all()


def get_truck(db: Session, truck_id: int):
    return db.query(Truck).filter(Truck.id == truck_id).first()


def update_truck(db: Session, truck_id: int, data: TruckUpdate):
    truck = db.query(Truck).filter(Truck.id == truck_id).first()

    if not truck:
        return None

    truck.driver_name = data.driver_name
    truck.location = data.location
    truck.temperature = data.temperature
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
        "message": "Truck Deleted Successfully"
    }