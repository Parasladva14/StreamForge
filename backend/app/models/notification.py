from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    message = Column(String(500), nullable=False)

    type = Column(String(30), default="info")  # critical, warning, success, info

    is_read = Column(Boolean, default=False, nullable=False)

    truck_id = Column(String(100), nullable=True, index=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
    )
