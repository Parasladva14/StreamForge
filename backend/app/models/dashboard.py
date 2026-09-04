from sqlalchemy import Column, Integer, Float

from app.database.base import Base


class Dashboard(Base):

    __tablename__ = "dashboard"

    id = Column(Integer, primary_key=True)

    total_trucks = Column(Integer)

    average_temperature = Column(Float)

    highest_temperature = Column(Float)

    lowest_temperature = Column(Float)

    alert_count = Column(Integer)