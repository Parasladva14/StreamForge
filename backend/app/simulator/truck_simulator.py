import asyncio
import random
import logging
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.truck import Truck
from app.websocket.manager import manager
from app.services.alert_service import create_alert
from app.services.notification_service import create_notification
from app.services.geofence_detector import check_truck_geofences
from app.services.truck_service import resolve_coordinates
from app.kafka.producer import send_temperature

logger = logging.getLogger(__name__)

_simulator_task: Optional[asyncio.Task] = None


async def simulate():
    db: Session = SessionLocal()

    try:
        trucks = db.query(Truck).all()
        updated_trucks = []

        for truck in trucks:
            old_temperature = truck.temperature
            old_lat = truck.latitude
            old_lng = truck.longitude

            # 1. Coordinate & movement simulation (for Active trucks)
            if truck.status == "Active":
                base_lat, base_lng = resolve_coordinates(truck.location, old_lat, old_lng)
                # Subtle movement
                lat_delta = random.uniform(-0.0006, 0.0006)
                lng_delta = random.uniform(-0.0006, 0.0006)
                new_lat = round(base_lat + lat_delta, 5)
                new_lng = round(base_lng + lng_delta, 5)

                truck.latitude = new_lat
                truck.longitude = new_lng
                truck.speed = round(max(30.0, min(80.0, (truck.speed or 55.0) + random.uniform(-3, 3))), 1)
                truck.fuel = round(max(10.0, min(100.0, (truck.fuel or 85.0) - random.uniform(0.01, 0.05))), 1)

                # 2. Check geofence enter/exit
                geofence_events = check_truck_geofences(db, truck.truck_id, truck.latitude, truck.longitude)
                for gf_event in geofence_events:
                    alert_level = "Warning" if gf_event["event_type"] == "geofence_exit" else "Info"
                    create_alert(
                        db=db,
                        truck_id=truck.truck_id,
                        temperature=truck.temperature,
                        level=alert_level,
                        message=gf_event["message"],
                    )
                    notif = create_notification(
                        db=db,
                        title=f"Geofence {gf_event['geofence_name']}",
                        message=gf_event["message"],
                        type="warning" if gf_event["event_type"] == "geofence_exit" else "info",
                        truck_id=truck.truck_id,
                    )
                    await manager.broadcast({
                        "event": "geofence_event",
                        "data": gf_event,
                        "notification": {
                            "id": notif.id,
                            "title": notif.title,
                            "message": notif.message,
                            "type": notif.type,
                            "is_read": notif.is_read,
                            "truck_id": notif.truck_id,
                            "created_at": notif.created_at.isoformat() if notif.created_at else None,
                        },
                    })

            # 3. Temperature simulation
            temp_change = random.randint(-2, 3)
            new_temperature = round(max(15.0, min(62.0, old_temperature + temp_change)), 1)
            truck.temperature = new_temperature

            # 4. Threshold detection and Alert/Notification creation
            if (old_temperature < 45.0 <= new_temperature) or (old_temperature < 52.0 <= new_temperature):
                level = "Critical" if new_temperature >= 50.0 else "Warning"
                alert_msg = f"Truck {truck.truck_id} temperature reached {new_temperature}°C"

                alert = create_alert(
                    db=db,
                    truck_id=truck.truck_id,
                    temperature=new_temperature,
                    level=level,
                    message=alert_msg,
                )

                notif = create_notification(
                    db=db,
                    title=f"Temperature {level}: {truck.truck_id}",
                    message=alert_msg,
                    type="critical" if level == "Critical" else "warning",
                    truck_id=truck.truck_id,
                )

                await manager.broadcast({
                    "event": "alert_created",
                    "alert": {
                        "id": alert.id,
                        "truck_id": alert.truck_id,
                        "temperature": alert.temperature,
                        "level": alert.level,
                        "message": alert.message,
                    },
                    "notification": {
                        "id": notif.id,
                        "title": notif.title,
                        "message": notif.message,
                        "type": notif.type,
                        "is_read": notif.is_read,
                        "truck_id": notif.truck_id,
                        "created_at": notif.created_at.isoformat() if notif.created_at else None,
                    },
                })

            updated_trucks.append(truck)

            # 5. Send event to Kafka stream
            send_temperature({
                "truck_id": truck.truck_id,
                "driver_name": truck.driver_name,
                "location": truck.location,
                "latitude": truck.latitude,
                "longitude": truck.longitude,
                "temperature": truck.temperature,
                "speed": truck.speed,
                "status": truck.status,
                "timestamp": datetime.utcnow().isoformat(),
            })

        db.commit()

        # 6. Broadcast updated truck status to WebSocket clients
        for truck in updated_trucks:
            map_status = "critical" if truck.temperature >= 50 else ("warning" if truck.temperature >= 45 else ("normal" if truck.status == "Active" else "inactive"))
            truck_payload = {
                "id": truck.id,
                "truck_id": truck.truck_id,
                "truck_no": truck.truck_id,
                "driver_name": truck.driver_name,
                "driver": truck.driver_name,
                "location": truck.location,
                "latitude": truck.latitude,
                "longitude": truck.longitude,
                "speed": truck.speed,
                "fuel": truck.fuel,
                "temperature": truck.temperature,
                "status": map_status,
                "operational_status": truck.status,
                "last_updated": datetime.utcnow().isoformat(),
            }
            await manager.broadcast({
                "event": "truck_updated",
                "truck": truck_payload,
            })
            # Also broadcast directly to trucks channel
            await manager.broadcast(truck_payload, channel="trucks")

    except Exception as e:
        logger.error(f"Error in truck simulation tick: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()


def start_simulator():
    """
    Safely start the background simulator loop, avoiding duplicate loops on reload.
    """
    global _simulator_task

    if _simulator_task is not None and not _simulator_task.done():
        logger.info("Simulator loop is already active.")
        return

    async def loop():
        logger.info("🚚 Simulator loop started.")
        while True:
            try:
                await simulate()
            except Exception as e:
                logger.error(f"Simulator error in loop: {e}")
            # Run simulation tick every 6 seconds
            await asyncio.sleep(6)

    _simulator_task = asyncio.create_task(loop())