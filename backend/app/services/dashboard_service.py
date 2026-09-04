from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.truck import Truck


def get_dashboard(db: Session):

    total = db.query(Truck).count()

    avg = db.query(func.avg(Truck.temperature)).scalar() or 0

    highest = db.query(func.max(Truck.temperature)).scalar() or 0

    lowest = db.query(func.min(Truck.temperature)).scalar() or 0

    alerts = db.query(Truck).filter(Truck.temperature > 40).count()

    return {
        "total_trucks": total,
        "average_temperature": round(avg, 2),
        "highest_temperature": highest,
        "lowest_temperature": lowest,
        "alert_count": alerts,
    }