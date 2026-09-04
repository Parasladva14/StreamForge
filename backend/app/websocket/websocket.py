from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import manager

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Register the client
    await manager.connect(websocket)
    print("✅ WebSocket Client Connected")

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()

            print(f"📩 Received: {data}")

            # Optional: Echo message back as JSON
            await websocket.send_json({
                "event": "message",
                "message": data
            })

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("❌ WebSocket Client Disconnected")

    except Exception as e:
        manager.disconnect(websocket)
        print(f"❌ WebSocket Error: {e}")