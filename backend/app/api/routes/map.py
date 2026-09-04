from fastapi import APIRouter

router = APIRouter(prefix="/trucks", tags=["Fleet Map"])

@router.get("/locations")
async def get_locations():
    return [
        {
            "id": 1,
            "truck_no": "TR-001",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "status": "normal",
            "speed": 58,
            "driver": "Rahul"
        },
        {
            "id": 2,
            "truck_no": "TR-002",
            "latitude": 19.095,
            "longitude": 72.89,
            "status": "critical",
            "speed": 0,
            "driver": "Amit"
        }
    ]