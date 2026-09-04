from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class GeofenceBase(BaseModel):

    name: str

    description: Optional[str] = None

    type: str = "circle"

    latitude: float

    longitude: float

    radius: Optional[float] = None

    active: bool = True


class GeofenceCreate(GeofenceBase):
    pass


class GeofenceUpdate(BaseModel):

    name: Optional[str] = None

    description: Optional[str] = None

    type: Optional[str] = None

    latitude: Optional[float] = None

    longitude: Optional[float] = None

    radius: Optional[float] = None

    active: Optional[bool] = None


class GeofenceResponse(GeofenceBase):

    id: int

    created_at: datetime

    class Config:
        from_attributes = True