from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.truck import Truck


def get_dashboard(db: Session):
    total = db.query(Truck).count()

    avg = db.query(func.avg(Truck.temperature)).scalar() or 0.0

    highest = db.query(func.max(Truck.temperature)).scalar() or 0.0

    lowest = db.query(func.min(Truck.temperature)).scalar() or 0.0

    alerts = db.query(Truck).filter(Truck.temperature >= 45.0).count()

    return {
        "total_trucks": total,
        "average_temperature": round(float(avg), 2),
        "highest_temperature": round(float(highest), 2),
        "lowest_temperature": round(float(lowest), 2),
        "alert_count": alerts,
    }