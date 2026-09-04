from fastapi import APIRouter, WebSocket

router = APIRouter()

clients = []

@router.websocket("/ws/trucks")
async def truck_socket(websocket: WebSocket):

    await websocket.accept()

    clients.append(websocket)

    try:
        while True:
            await websocket.receive_text()

    except Exception:
        if websocket in clients:
            clients.remove(websocket)