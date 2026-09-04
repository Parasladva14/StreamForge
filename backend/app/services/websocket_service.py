from app.api.routes.websocket import clients

async def broadcast_notification(notification):

    disconnected = []

    for client in clients:

        try:

            await client.send_json(notification)

        except:

            disconnected.append(client)

    for client in disconnected:

        clients.remove(client)