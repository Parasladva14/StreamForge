from fastapi import APIRouter
from app.services.route_history_service import get_route_history

router = APIRouter(prefix="/route")

@router.get("/{truck_id}")
def history(truck_id: str):
    return get_route_history(truck_id)