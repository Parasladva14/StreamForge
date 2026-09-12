"""
Tests for Truck CRUD API endpoints.
"""
import pytest
from app.tests.conftest import get_admin_token, get_viewer_token, auth_header


TRUCK_PAYLOAD = {
    "truck_id": "TRK-TEST-001",
    "driver_name": "Test Driver",
    "location": "Mumbai, India",
    "temperature": 22.5,
    "status": "Active",
    "latitude": 19.0760,
    "longitude": 72.8777,
    "speed": 60.0,
    "fuel": 80.0,
}


def test_create_truck_admin(client):
    token = get_admin_token(client)
    res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 201
    data = res.json()
    assert data["truck_id"] == "TRK-TEST-001"
    assert data["driver_name"] == "Test Driver"
    assert data["temperature"] == 22.5


def test_create_truck_viewer_forbidden(client):
    token = get_viewer_token(client)
    res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 403


def test_create_truck_duplicate_id(client):
    token = get_admin_token(client)
    client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 400


def test_get_all_trucks(client):
    token = get_admin_token(client)
    client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    res = client.get("/truck/", headers=auth_header(token))
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert len(res.json()) >= 1


def test_get_truck_by_id(client):
    token = get_admin_token(client)
    create_res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    truck_id = create_res.json()["id"]
    res = client.get(f"/truck/{truck_id}", headers=auth_header(token))
    assert res.status_code == 200
    assert res.json()["truck_id"] == "TRK-TEST-001"


def test_get_truck_not_found(client):
    token = get_admin_token(client)
    res = client.get("/truck/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_update_truck(client):
    token = get_admin_token(client)
    create_res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    truck_id = create_res.json()["id"]
    update_res = client.put(
        f"/truck/{truck_id}",
        json={"driver_name": "Updated Driver", "temperature": 30.0},
        headers=auth_header(token),
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["driver_name"] == "Updated Driver"
    assert data["temperature"] == 30.0


def test_update_truck_not_found(client):
    token = get_admin_token(client)
    res = client.put(
        "/truck/9999",
        json={"driver_name": "Ghost"},
        headers=auth_header(token),
    )
    assert res.status_code == 404


def test_delete_truck(client):
    token = get_admin_token(client)
    create_res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token))
    truck_id = create_res.json()["id"]
    del_res = client.delete(f"/truck/{truck_id}", headers=auth_header(token))
    assert del_res.status_code == 200
    assert "deleted" in del_res.json()["message"].lower()


def test_delete_truck_not_found(client):
    token = get_admin_token(client)
    res = client.delete("/truck/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_delete_truck_viewer_forbidden(client):
    token_admin = get_admin_token(client)
    create_res = client.post("/truck/", json=TRUCK_PAYLOAD, headers=auth_header(token_admin))
    truck_id = create_res.json()["id"]

    token_viewer = get_viewer_token(client)
    res = client.delete(f"/truck/{truck_id}", headers=auth_header(token_viewer))
    assert res.status_code == 403


def test_recent_trucks(client):
    token = get_admin_token(client)
    for i in range(3):
        payload = {**TRUCK_PAYLOAD, "truck_id": f"TRK-REC-{i:03d}"}
        client.post("/truck/", json=payload, headers=auth_header(token))
    res = client.get("/truck/recent", headers=auth_header(token))
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_create_truck_validation_errors(client):
    token = get_admin_token(client)
    # Missing required fields
    res = client.post("/truck/", json={}, headers=auth_header(token))
    assert res.status_code == 422

    # Temperature out of range
    bad = {**TRUCK_PAYLOAD, "truck_id": "TRK-BAD", "temperature": 200.0}
    res = client.post("/truck/", json=bad, headers=auth_header(token))
    assert res.status_code == 422
