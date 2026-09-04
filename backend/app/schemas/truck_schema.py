from pydantic import BaseModel
from datetime import datetime


class TruckBase(BaseModel):
    truck_id: str
    driver_name: str
    location: str
    temperature: float
    status: str = "Active"


class TruckCreate(TruckBase):
    pass


class TruckUpdate(BaseModel):
    driver_name: str
    location: str
    temperature: float
    status: str


class TruckResponse(TruckBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True