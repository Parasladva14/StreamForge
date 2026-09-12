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