from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class NotificationBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    message: str = Field(..., min_length=1, max_length=500)
    type: str = Field(default="info", max_length=30)
    truck_id: Optional[str] = Field(default=None, max_length=100)


class NotificationCreate(NotificationBase):
    is_read: Optional[bool] = False


class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
