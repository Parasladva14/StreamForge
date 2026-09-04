from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Truck(Base):
    __tablename__ = "trucks"

    id = Column(Integer, primary_key=True, index=True)

    truck_id = Column(String(100), unique=True, nullable=False)

    driver_name = Column(String(100), nullable=False)

    location = Column(String(255), nullable=False)

    temperature = Column(Float, nullable=False)

    status = Column(String(50), default="Active")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )