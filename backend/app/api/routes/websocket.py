from fastapi import APIRouter, WebSocket

router = APIRouter()

clients = []

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    clients.append(websocket)

    try:

        while True:

            await websocket.receive_text()

    except:

        clients.remove(websocket)