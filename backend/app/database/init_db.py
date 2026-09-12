from app.database.base import Base
from app.database.database import engine, SessionLocal
from app.security.jwt import hash_password

from app.models.user import User
from app.models.truck import Truck
from app.models.alert import Alert
from app.models.geofence import Geofence
from app.models.notification import Notification
import app.models.dashboard


def init_db():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Default Users if none exist
        if db.query(User).count() == 0:
            default_users = [
                User(
                    username="Admin User",
                    email="admin@streamforge.com",
                    password=hash_password("admin123"),
                    role="Admin",
                ),
                User(
                    username="Fleet Operator",
                    email="operator@streamforge.com",
                    password=hash_password("operator123"),
                    role="Operator",
                ),
                User(
                    username="Fleet Viewer",
                    email="viewer@streamforge.com",
                    password=hash_password("viewer123"),
                    role="Viewer",
                ),
            ]
            db.add_all(default_users)
            db.commit()
            print("👤 Default users seeded (admin@streamforge.com / admin123).")

        # 2. Seed Default Demo Trucks if none exist
        if db.query(Truck).count() == 0:
            default_trucks = [
                Truck(
                    truck_id="TR-1001",
                    driver_name="Rajesh Kumar",
                    location="Mumbai",
                    latitude=19.0760,
                    longitude=72.8777,
                    speed=58.0,
                    fuel=85.0,
                    temperature=28.5,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1002",
                    driver_name="Suresh Patel",
                    location="Delhi",
                    latitude=28.6139,
                    longitude=77.2090,
                    speed=62.0,
                    fuel=90.0,
                    temperature=34.0,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1003",
                    driver_name="Amit Sharma",
                    location="Bengaluru",
                    latitude=12.9716,
                    longitude=77.5946,
                    speed=0.0,
                    fuel=45.0,
                    temperature=46.2,
                    status="Maintenance",
                ),
                Truck(
                    truck_id="TR-1004",
                    driver_name="Priya Singh",
                    location="Pune",
                    latitude=18.5204,
                    longitude=73.8567,
                    speed=52.0,
                    fuel=78.0,
                    temperature=22.5,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1005",
                    driver_name="Vikas Verma",
                    location="Ahmedabad",
                    latitude=23.0225,
                    longitude=72.5714,
                    speed=68.0,
                    fuel=82.0,
                    temperature=51.8,
                    status="Active",
                ),
            ]
            db.add_all(default_trucks)
            db.commit()
            print("🚚 Default demo fleet seeded with coordinates.")

        # 3. Seed Default Geofences if none exist
        if db.query(Geofence).count() == 0:
            default_geofences = [
                Geofence(
                    name="Mumbai Central Depot",
                    description="Primary warehousing and cold storage depot",
                    type="circle",
                    latitude=19.0760,
                    longitude=72.8777,
                    radius=2500.0,
                    active=True,
                ),
                Geofence(
                    name="Pune Logistics Terminal",
                    description="Regional distribution center",
                    type="circle",
                    latitude=18.5204,
                    longitude=73.8567,
                    radius=3000.0,
                    active=True,
                ),
                Geofence(
                    name="Delhi NCR Cargo Hub",
                    description="Northern region hub and staging area",
                    type="circle",
                    latitude=28.6139,
                    longitude=77.2090,
                    radius=4000.0,
                    active=True,
                ),
            ]
            db.add_all(default_geofences)
            db.commit()
            print("🌍 Default geofences seeded.")

        # 4. Seed Default Notifications if none exist
        if db.query(Notification).count() == 0:
            default_notifications = [
                Notification(
                    title="System Initialized",
                    message="StreamForge Fleet Telemetry Monitoring System is online and running.",
                    type="success",
                    is_read=False,
                    truck_id=None,
                ),
                Notification(
                    title="High Temperature Warning",
                    message="Truck TR-1003 recorded elevated cargo temperature (46.2°C). Maintenance recommended.",
                    type="warning",
                    is_read=False,
                    truck_id="TR-1003",
                ),
                Notification(
                    title="Critical Temperature Alert",
                    message="Truck TR-1005 temperature reached 51.8°C exceeding critical threshold.",
                    type="critical",
                    is_read=False,
                    truck_id="TR-1005",
                ),
            ]
            db.add_all(default_notifications)
            db.commit()
            print("🔔 Default notifications seeded.")

    except Exception as e:
        print(f"⚠️ Database seed note: {e}")
        db.rollback()
    finally:
        db.close()