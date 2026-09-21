from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role

from app.schemas.truck_schema import (
    TruckCreate,
    TruckUpdate,
    TruckResponse,
)

from app.services.truck_service import (
    create_truck,
    get_all_trucks,
    get_truck,
    update_truck,
    delete_truck,
)

from app.websocket.manager import manager

router = APIRouter(
    prefix="/truck",
    tags=["Truck"],
)


# ==========================================
# Truck Locations (for Fleet Map)
# ==========================================
@router.get("/locations")
def truck_locations(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    trucks = get_all_trucks(db)
    return [
        {
            "id": t.id,
            "truck_id": t.truck_id,
            "driver_name": t.driver_name,
            "location": t.location,
            "latitude": t.latitude,
            "longitude": t.longitude,
            "speed": t.speed,
            "fuel": t.fuel,
            "temperature": t.temperature,
            "status": t.status,
        }
        for t in trucks
    ]


# ==========================================
# Create Truck (Admin Only)
# ==========================================
@router.post("/", response_model=TruckResponse, status_code=201)
async def create(
    data: TruckCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):
    try:
        truck = create_truck(db, data)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    await manager.broadcast({
        "event": "truck_created",
        "truck": {
            "id": truck.id,
            "truck_id": truck.truck_id,
            "truck_no": truck.truck_id,
            "driver_name": truck.driver_name,
            "driver": truck.driver_name,
            "location": truck.location,
            "latitude": truck.latitude,
            "longitude": truck.longitude,
            "speed": truck.speed,
            "fuel": truck.fuel,
            "temperature": truck.temperature,
            "status": truck.status,
        },
    })

    return truck



# ==========================================
# Get All Trucks
# ==========================================
@router.get("/", response_model=list[TruckResponse])
def trucks(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    return get_all_trucks(db)


# ==========================================
# Recent Trucks
# ==========================================
@router.get("/recent", response_model=list[TruckResponse])
def recent_trucks(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    trucks = get_all_trucks(db)

    return sorted(
        trucks,
        key=lambda x: x.id,
        reverse=True,
    )[:10]


# ==========================================
# Get Truck By ID
# ==========================================
@router.get("/{truck_id}", response_model=TruckResponse)
def single_truck(
    truck_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator", "Viewer")
    ),
):
    truck = get_truck(db, truck_id)

    if truck is None:
        raise HTTPException(
            status_code=404,
            detail="Truck Not Found",
        )

    return truck


# ==========================================
# Update Truck
# Admin & Operator
# ==========================================
@router.put("/{truck_id}", response_model=TruckResponse)
async def update(
    truck_id: int,
    data: TruckUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("Admin", "Operator")
    ),
):
    truck = update_truck(db, truck_id, data)

    if truck is None:
        raise HTTPException(
            status_code=404,
            detail="Truck Not Found",
        )

    await manager.broadcast({
        "event": "truck_updated",
        "truck": {
            "id": truck.id,
            "truck_id": truck.truck_id,
            "truck_no": truck.truck_id,
            "driver_name": truck.driver_name,
            "driver": truck.driver_name,
            "location": truck.location,
            "latitude": truck.latitude,
            "longitude": truck.longitude,
            "speed": truck.speed,
            "fuel": truck.fuel,
            "temperature": truck.temperature,
            "status": truck.status,
        },
    })

    return truck


# ==========================================
# Delete Truck
# Admin Only
# ==========================================
@router.delete("/{truck_id}")
async def delete(
    truck_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):
    result = delete_truck(db, truck_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Truck Not Found",
        )

    await manager.broadcast({
        "event": "truck_deleted",
        "truck_id": truck_id,
    })

    return {
        "message": "Truck deleted successfully",
        "truck_id": truck_id,
    }