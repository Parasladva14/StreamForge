from sqlalchemy.orm import Session

from app.models.geofence import Geofence
from app.schemas.geofence import (
    GeofenceCreate,
    GeofenceUpdate,
)


def get_geofences(db: Session):

    return (
        db.query(Geofence)
        .order_by(Geofence.id.desc())
        .all()
    )


def get_geofence(
    db: Session,
    geofence_id: int
):

    return (
        db.query(Geofence)
        .filter(
            Geofence.id == geofence_id
        )
        .first()
    )


def create_geofence(
    db: Session,
    data: GeofenceCreate
):

    geofence = Geofence(
        name=data.name,
        description=data.description,
        type=data.type,
        latitude=data.latitude,
        longitude=data.longitude,
        radius=data.radius,
        active=data.active,
    )

    db.add(geofence)

    db.commit()

    db.refresh(geofence)

    return geofence


def update_geofence(
    db: Session,
    geofence_id: int,
    data: GeofenceUpdate
):

    geofence = get_geofence(
        db,
        geofence_id
    )

    if not geofence:
        return None

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        setattr(
            geofence,
            field,
            value
        )

    db.commit()

    db.refresh(geofence)

    return geofence


def delete_geofence(
    db: Session,
    geofence_id: int
):

    geofence = get_geofence(
        db,
        geofence_id
    )

    if not geofence:
        return None

    db.delete(geofence)

    db.commit()

    return geofence