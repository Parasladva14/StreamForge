from app.database.base import Base
from app.database.database import engine

import app.models.dashboard
import app.models.truck
import app.models.alert
import app.models.user
import app.models.geofence


def init_db():
    Base.metadata.create_all(bind=engine)