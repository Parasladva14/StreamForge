"""
Tests for Geofence CRUD API endpoints and Haversine detection logic.
"""
import pytest
from app.tests.conftest import (
    get_admin_token,
    get_operator_token,
    get_viewer_token,
    auth_header,
)
from app.services.geofence_detector import haversine_distance, reset_geofence_state


GEOFENCE_PAYLOAD = {
    "name": "Mumbai Port Zone",
    "description": "Mumbai port delivery area",
    "type": "circle",
    "latitude": 18.9400,
    "longitude": 72.8350,
    "radius": 5000.0,
    "active": True,
}


# =====================================================
# Haversine Unit Tests
# =====================================================


def test_haversine_same_point():
    dist = haversine_distance(19.0760, 72.8777, 19.0760, 72.8777)
    assert dist == 0.0


def test_haversine_known_distance():
    # Mumbai (19.0760, 72.8777) to Delhi (28.6139, 77.2090) ~ 1153 km
    dist = haversine_distance(19.0760, 72.8777, 28.6139, 77.2090)
    # Allow within 10km tolerance
    assert 1140_000 < dist < 1170_000


def test_haversine_short_distance():
    # ~111 meters for 0.001 degree latitude
    dist = haversine_distance(19.0760, 72.8777, 19.0770, 72.8777)
    assert 100 < dist < 120


def test_haversine_invalid_latitude():
    dist = haversine_distance(100.0, 72.0, 19.0, 72.0)
    assert dist == float("inf")


def test_haversine_invalid_longitude():
    dist = haversine_distance(19.0, 200.0, 19.0, 72.0)
    assert dist == float("inf")


# =====================================================
# Geofence CRUD API Tests
# =====================================================


def test_create_geofence_admin(client):
    token = get_admin_token(client)
    res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Mumbai Port Zone"
    assert data["latitude"] == 18.9400
    assert data["active"] is True


def test_create_geofence_operator(client):
    token = get_operator_token(client)
    res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 201


def test_create_geofence_viewer_forbidden(client):
    token = get_viewer_token(client)
    res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    assert res.status_code == 403


def test_get_all_geofences(client):
    token = get_admin_token(client)
    client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    res = client.get("/geofences", headers=auth_header(token))
    assert res.status_code == 200
    assert isinstance(res.json(), list)
    assert len(res.json()) >= 1


def test_get_single_geofence(client):
    token = get_admin_token(client)
    create_res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    gid = create_res.json()["id"]
    res = client.get(f"/geofences/{gid}", headers=auth_header(token))
    assert res.status_code == 200
    assert res.json()["name"] == "Mumbai Port Zone"


def test_get_geofence_not_found(client):
    token = get_admin_token(client)
    res = client.get("/geofences/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_update_geofence(client):
    token = get_admin_token(client)
    create_res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    gid = create_res.json()["id"]
    res = client.put(
        f"/geofences/{gid}",
        json={"name": "Updated Zone", "radius": 8000.0},
        headers=auth_header(token),
    )
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Updated Zone"
    assert data["radius"] == 8000.0


def test_update_geofence_not_found(client):
    token = get_admin_token(client)
    res = client.put(
        "/geofences/9999",
        json={"name": "Ghost"},
        headers=auth_header(token),
    )
    assert res.status_code == 404


def test_delete_geofence_admin(client):
    token = get_admin_token(client)
    create_res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token))
    gid = create_res.json()["id"]
    res = client.delete(f"/geofences/{gid}", headers=auth_header(token))
    assert res.status_code == 200
    assert "deleted" in res.json()["message"].lower()


def test_delete_geofence_not_found(client):
    token = get_admin_token(client)
    res = client.delete("/geofences/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_delete_geofence_viewer_forbidden(client):
    token_admin = get_admin_token(client)
    create_res = client.post("/geofences", json=GEOFENCE_PAYLOAD, headers=auth_header(token_admin))
    gid = create_res.json()["id"]

    token_viewer = get_viewer_token(client)
    res = client.delete(f"/geofences/{gid}", headers=auth_header(token_viewer))
    assert res.status_code == 403
