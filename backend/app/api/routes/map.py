from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role
from app.models.truck import Truck
from app.services.truck_service import resolve_coordinates

router = APIRouter(prefix="/trucks", tags=["Fleet Map"])


@router.get("/locations")
def get_locations(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    trucks = db.query(Truck).all()

    locations = []
    for t in trucks:
        lat, lng = resolve_coordinates(t.location, t.latitude, t.longitude)

        # Derive map status based on temperature and operational status
        if t.temperature >= 50.0:
            map_status = "critical"
        elif t.temperature >= 45.0:
            map_status = "warning"
        elif t.status == "Active":
            map_status = "normal"
        else:
            map_status = "inactive"

        locations.append({
            "id": t.id,
            "truck_id": t.truck_id,
            "truck_no": t.truck_id,
            "driver": t.driver_name,
            "driver_name": t.driver_name,
            "location": t.location,
            "latitude": lat,
            "longitude": lng,
            "speed": round(t.speed or 55.0, 1),
            "fuel": round(t.fuel or 85.0, 1),
            "battery": 98,
            "engine_status": "Running" if t.status == "Active" else "Stopped",
            "temperature": t.temperature,
            "status": map_status,
            "operational_status": t.status,
            "last_updated": t.updated_at.isoformat() if t.updated_at else datetime.utcnow().isoformat(),
        })

    return locations