from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class TruckBase(BaseModel):
    truck_id: str = Field(..., min_length=1, max_length=100)
    driver_name: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=255)
    temperature: float = Field(..., ge=-50.0, le=120.0)
    status: str = Field(default="Active", max_length=50)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed: Optional[float] = 0.0
    fuel: Optional[float] = 100.0


class TruckCreate(TruckBase):
    pass


class TruckUpdate(BaseModel):
    driver_name: Optional[str] = None
    location: Optional[str] = None
    temperature: Optional[float] = None
    status: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    speed: Optional[float] = None
    fuel: Optional[float] = None


class TruckResponse(TruckBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)