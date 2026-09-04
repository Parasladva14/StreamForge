from pydantic import BaseModel


class DashboardResponse(BaseModel):

    total_trucks: int

    average_temperature: float

    highest_temperature: float

    lowest_temperature: float

    alert_count: int

    class Config:
        from_attributes = True