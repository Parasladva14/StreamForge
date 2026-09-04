from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.geofence import (
    GeofenceCreate,
    GeofenceResponse,
    GeofenceUpdate,
)

from app.services.geofence_service import (
    get_geofences,
    get_geofence,
    create_geofence,
    update_geofence,
    delete_geofence,
)


router = APIRouter(
    prefix="/geofences",
    tags=["Geofences"],
)


# =========================================================
# GET ALL GEOFENCES
# =========================================================

@router.get(
    "",
    response_model=List[GeofenceResponse],
)
def list_geofences(
    db: Session = Depends(get_db),
):

    return get_geofences(db)


# =========================================================
# GET SINGLE GEOFENCE
# =========================================================

@router.get(
    "/{geofence_id}",
    response_model=GeofenceResponse,
)
def read_geofence(
    geofence_id: int,
    db: Session = Depends(get_db),
):

    geofence = get_geofence(
        db,
        geofence_id,
    )

    if not geofence:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geofence not found",
        )

    return geofence


# =========================================================
# CREATE GEOFENCE
# =========================================================

@router.post(
    "",
    response_model=GeofenceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_geofence(
    data: GeofenceCreate,
    db: Session = Depends(get_db),
):

    return create_geofence(
        db,
        data,
    )


# =========================================================
# UPDATE GEOFENCE
# =========================================================

@router.put(
    "/{geofence_id}",
    response_model=GeofenceResponse,
)
def update_existing_geofence(
    geofence_id: int,
    data: GeofenceUpdate,
    db: Session = Depends(get_db),
):

    geofence = update_geofence(
        db,
        geofence_id,
        data,
    )

    if not geofence:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geofence not found",
        )

    return geofence


# =========================================================
# DELETE GEOFENCE
# =========================================================

@router.delete(
    "/{geofence_id}",
)
def delete_existing_geofence(
    geofence_id: int,
    db: Session = Depends(get_db),
):

    geofence = delete_geofence(
        db,
        geofence_id,
    )

    if not geofence:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Geofence not found",
        )

    return {
        "message": "Geofence deleted successfully",
        "id": geofence_id,
    }