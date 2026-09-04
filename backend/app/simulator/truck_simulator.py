import asyncio
import random

from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.truck import Truck
from app.websocket.manager import manager
from app.services.alert_service import create_alert


async def simulate():
    db: Session = SessionLocal()

    try:
        trucks = db.query(Truck).all()

        updated_trucks = []

        for truck in trucks:

            old_temperature = truck.temperature

            # Random temperature change
            change = random.randint(-2, 4)

            new_temperature = max(15, min(60, old_temperature + change))

            # Skip if no change
            if new_temperature == old_temperature:
                continue

            truck.temperature = new_temperature

            # ---------------------------------------------------
            # Create Alert ONLY when temperature crosses threshold
            # ---------------------------------------------------
            if old_temperature < 45 <= new_temperature:

                if new_temperature >= 55:
                    level = "Critical"
                else:
                    level = "Warning"

                alert = create_alert(
    db=db,
    truck_id=truck.truck_id,
    temperature=new_temperature,
    level=level,
    message=f"Truck {truck.truck_id} temperature reached {new_temperature}°C"
)
                await manager.broadcast({
    "event": "alert_created",
    "alert": {
        "id": alert.id,
        "truck_id": alert.truck_id,
        "temperature": alert.temperature,
        "level": alert.level,
        "message": alert.message
    }
})

            updated_trucks.append(truck)

        # Save updated truck temperatures
        db.commit()

        # Broadcast only updated trucks
        for truck in updated_trucks:
            await manager.broadcast({
                "event": "truck_updated",
                "truck": {
                    "id": truck.id,
                    "truck_id": truck.truck_id,
                    "location": truck.location,
                    "temperature": truck.temperature
                }
            })

    finally:
        db.close()


def start_simulator():

    async def loop():

        while True:

            await simulate()

            # Run every 10 seconds
            await asyncio.sleep(10)

    asyncio.create_task(loop())