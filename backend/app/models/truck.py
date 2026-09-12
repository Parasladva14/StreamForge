from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Truck(Base):
    __tablename__ = "trucks"

    id = Column(Integer, primary_key=True, index=True)

    truck_id = Column(String(100), unique=True, nullable=False, index=True)

    driver_name = Column(String(100), nullable=False)

    location = Column(String(255), nullable=False)

    latitude = Column(Float, nullable=True, default=19.0760)

    longitude = Column(Float, nullable=True, default=72.8777)

    speed = Column(Float, nullable=True, default=55.0)

    fuel = Column(Float, nullable=True, default=85.0)

    temperature = Column(Float, nullable=False)

    status = Column(String(50), default="Active")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )