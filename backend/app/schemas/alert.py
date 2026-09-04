from datetime import datetime

from pydantic import BaseModel


class AlertBase(BaseModel):
    truck_id: str
    temperature: float
    level: str
    message: str


class AlertCreate(AlertBase):
    pass


class AlertResponse(AlertBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True