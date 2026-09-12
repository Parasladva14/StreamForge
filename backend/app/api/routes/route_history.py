from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role
from app.services.route_history_service import get_route_history

router = APIRouter(prefix="/route", tags=["Route History"])


@router.get("/{truck_id}")
def history(
    truck_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    return get_route_history(truck_id, db=db)