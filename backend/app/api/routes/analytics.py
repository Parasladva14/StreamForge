from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role
from app.services.analytics_service import (
    get_dashboard_summary,
    get_temperature_trend,
    get_status_distribution,
    get_location_distribution,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# ==========================================
# Dashboard Summary
# ==========================================
@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    )
):
    return get_dashboard_summary(db)


# ==========================================
# Temperature Trend
# ==========================================
@router.get("/temperature-trend")
def temperature_trend(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    return get_temperature_trend(db)


# ==========================================
# Status Distribution
# ==========================================
@router.get("/status-distribution")
def status_distribution(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    return get_status_distribution(db)


# ==========================================
# Location Distribution
# ==========================================
@router.get("/location-distribution")
def location_distribution(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    return get_location_distribution(db)