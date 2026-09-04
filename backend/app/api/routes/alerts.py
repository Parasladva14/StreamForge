from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.alert import AlertCreate, AlertResponse
from app.services.alert_service import (
    create_alert,
    get_recent_alerts,
    get_alert_count,
    get_critical_alert_count,
)

router = APIRouter(
    prefix="/alerts",
    tags=["Alerts"],
)


@router.get("/", response_model=list[AlertResponse])
def read_alerts(
    db: Session = Depends(get_db),
):
    """
    Get recent alerts.
    """
    return get_recent_alerts(db)


@router.get("/count")
def alert_count(
    db: Session = Depends(get_db),
):
    """
    Get alert statistics.
    """
    return {
        "total_alerts": get_alert_count(db),
        "critical_alerts": get_critical_alert_count(db),
    }


@router.post("/", response_model=AlertResponse)
def add_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new alert.
    """
    return create_alert(
        db=db,
        truck_id=alert.truck_id,
        temperature=alert.temperature,
        level=alert.level,
        message=alert.message,
    )