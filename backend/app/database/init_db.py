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
                Truck(
                    truck_id="TR-1006",
                    driver_name="Deepak Yadav",
                    location="Hyderabad",
                    latitude=17.3850,
                    longitude=78.4867,
                    speed=55.0,
                    fuel=72.0,
                    temperature=31.4,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1007",
                    driver_name="Kiran Desai",
                    location="Chennai",
                    latitude=13.0827,
                    longitude=80.2707,
                    speed=0.0,
                    fuel=95.0,
                    temperature=26.8,
                    status="Inactive",
                ),
                Truck(
                    truck_id="TR-1008",
                    driver_name="Manish Tiwari",
                    location="Kolkata",
                    latitude=22.5726,
                    longitude=88.3639,
                    speed=48.0,
                    fuel=65.0,
                    temperature=33.2,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1009",
                    driver_name="Anita Reddy",
                    location="Jaipur",
                    latitude=26.9124,
                    longitude=75.7873,
                    speed=72.0,
                    fuel=88.0,
                    temperature=38.9,
                    status="In Transit",
                ),
                Truck(
                    truck_id="TR-1010",
                    driver_name="Sanjay Gupta",
                    location="Lucknow",
                    latitude=26.8467,
                    longitude=80.9462,
                    speed=0.0,
                    fuel=20.0,
                    temperature=44.5,
                    status="Maintenance",
                ),
                Truck(
                    truck_id="TR-1011",
                    driver_name="Neha Kapoor",
                    location="Chandigarh",
                    latitude=30.7333,
                    longitude=76.7794,
                    speed=60.0,
                    fuel=76.0,
                    temperature=19.3,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1012",
                    driver_name="Rohit Malhotra",
                    location="Nagpur",
                    latitude=21.1458,
                    longitude=79.0882,
                    speed=65.0,
                    fuel=58.0,
                    temperature=29.7,
                    status="In Transit",
                ),
                Truck(
                    truck_id="TR-1013",
                    driver_name="Pooja Nair",
                    location="Kochi",
                    latitude=9.9312,
                    longitude=76.2673,
                    speed=42.0,
                    fuel=91.0,
                    temperature=27.1,
                    status="Active",
                ),
                Truck(
                    truck_id="TR-1014",
                    driver_name="Arjun Mehta",
                    location="Indore",
                    latitude=22.7196,
                    longitude=75.8577,
                    speed=0.0,
                    fuel=35.0,
                    temperature=48.6,
                    status="Maintenance",
                ),
                Truck(
                    truck_id="TR-1015",
                    driver_name="Kavita Joshi",
                    location="Surat",
                    latitude=21.1702,
                    longitude=72.8311,
                    speed=70.0,
                    fuel=80.0,
                    temperature=24.0,
                    status="Active",
                ),
            ]
            db.add_all(default_trucks)
            db.commit()
            print("🚚 Default demo fleet seeded (15 trucks) with coordinates.")

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