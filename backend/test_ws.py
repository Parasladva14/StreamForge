import asyncio
import websockets


async def main():
    uri = "ws://127.0.0.1:8000/ws"

    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected")

            await websocket.send("Hello")
            reply = await websocket.recv()

            print("Server:", reply)

    except Exception as e:
        print(type(e).__name__)
        print(e)


asyncio.run(main())