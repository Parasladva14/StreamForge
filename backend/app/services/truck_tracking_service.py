from app.websocket.manager import manager


async def broadcast_location(location: dict):
    """
    Broadcast updated truck telemetry and location to connected clients.
    """
    await manager.broadcast(location, channel="trucks")