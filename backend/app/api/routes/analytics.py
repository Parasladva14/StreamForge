from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role
from app.services.analytics_service import get_dashboard_summary

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