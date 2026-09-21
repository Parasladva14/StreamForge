from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.truck import Truck
from app.models.alert import Alert


def get_dashboard_summary(db: Session):
    total_trucks = db.query(Truck).count()

    active_trucks = (
        db.query(Truck)
        .filter(Truck.status == "Active")
        .count()
    )

    inactive_trucks = (
        db.query(Truck)
        .filter(Truck.status == "Inactive")
        .count()
    )

    maintenance_trucks = (
        db.query(Truck)
        .filter(Truck.status == "Maintenance")
        .count()
    )

    highest_temperature = (
        db.query(func.max(Truck.temperature))
        .scalar()
        or 0.0
    )

    average_temperature = (
        db.query(func.avg(Truck.temperature))
        .scalar()
        or 0.0
    )

    critical_alerts = (
        db.query(Alert)
        .filter(Alert.level == "Critical")
        .count()
    )

    return {
        "total_trucks": total_trucks,
        "active_trucks": active_trucks,
        "inactive_trucks": inactive_trucks,
        "maintenance_trucks": maintenance_trucks,
        "highest_temperature": round(float(highest_temperature), 2),
        "average_temperature": round(float(average_temperature), 2),
        "critical_alerts": critical_alerts,
    }


def get_temperature_trend(db: Session):
    """
    Return per-truck temperature data for trend charting.
    """
    trucks = db.query(Truck).order_by(Truck.id.asc()).all()
    return [
        {
            "truck_id": t.truck_id,
            "temperature": round(float(t.temperature), 1),
            "location": t.location,
            "status": t.status,
        }
        for t in trucks
    ]


def get_status_distribution(db: Session):
    """
    Return the count of trucks grouped by operational status.
    """
    rows = (
        db.query(Truck.status, func.count(Truck.id))
        .group_by(Truck.status)
        .all()
    )
    return [
        {"status": status, "count": count}
        for status, count in rows
    ]


def get_location_distribution(db: Session):
    """
    Return the count of trucks grouped by location.
    """
    rows = (
        db.query(Truck.location, func.count(Truck.id))
        .group_by(Truck.location)
        .all()
    )
    return [
        {"location": location, "count": count}
        for location, count in rows
    ]