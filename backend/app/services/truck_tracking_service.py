from app.api.routes.truck_websocket import clients

async def broadcast_location(location):

    disconnected = []

    for client in clients:
        try:
            await client.send_json(location)
        except Exception:
            disconnected.append(client)

    for client in disconnected:
        clients.remove(client)