"""
Tests for Notification CRUD API endpoints.
"""
import pytest
from app.tests.conftest import (
    get_admin_token,
    get_operator_token,
    get_viewer_token,
    auth_header,
)


NOTIF_PAYLOAD = {
    "title": "High Temperature Alert",
    "message": "Truck TRK-001 exceeded 40°C threshold",
    "type": "critical",
    "truck_id": "TRK-001",
}


def _create_notification(client, token):
    return client.post("/notifications", json=NOTIF_PAYLOAD, headers=auth_header(token))


def test_create_notification_admin(client):
    token = get_admin_token(client)
    res = _create_notification(client, token)
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == NOTIF_PAYLOAD["title"]
    assert data["type"] == "critical"
    assert data["is_read"] is False


def test_create_notification_operator(client):
    token = get_operator_token(client)
    res = _create_notification(client, token)
    assert res.status_code == 201


def test_create_notification_viewer_forbidden(client):
    token = get_viewer_token(client)
    res = _create_notification(client, token)
    assert res.status_code == 403


def test_get_all_notifications(client):
    token = get_admin_token(client)
    _create_notification(client, token)
    _create_notification(client, token)
    res = client.get("/notifications", headers=auth_header(token))
    assert res.status_code == 200
    assert len(res.json()) >= 2


def test_get_single_notification(client):
    token = get_admin_token(client)
    create_res = _create_notification(client, token)
    notif_id = create_res.json()["id"]
    res = client.get(f"/notifications/{notif_id}", headers=auth_header(token))
    assert res.status_code == 200
    assert res.json()["id"] == notif_id


def test_get_notification_not_found(client):
    token = get_admin_token(client)
    res = client.get("/notifications/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_get_unread_notifications(client):
    token = get_admin_token(client)
    _create_notification(client, token)
    res = client.get("/notifications/unread", headers=auth_header(token))
    assert res.status_code == 200
    assert all(n["is_read"] is False for n in res.json())


def test_mark_as_read(client):
    token = get_admin_token(client)
    create_res = _create_notification(client, token)
    notif_id = create_res.json()["id"]
    res = client.patch(f"/notifications/{notif_id}/read", headers=auth_header(token))
    assert res.status_code == 200
    assert res.json()["is_read"] is True


def test_mark_as_read_not_found(client):
    token = get_admin_token(client)
    res = client.patch("/notifications/9999/read", headers=auth_header(token))
    assert res.status_code == 404


def test_mark_all_as_read(client):
    token = get_admin_token(client)
    _create_notification(client, token)
    _create_notification(client, token)
    res = client.patch("/notifications/read-all", headers=auth_header(token))
    assert res.status_code == 200
    assert "updated_count" in res.json()

    # Verify all are read
    unread = client.get("/notifications/unread", headers=auth_header(token))
    assert len(unread.json()) == 0


def test_delete_notification_admin(client):
    token = get_admin_token(client)
    create_res = _create_notification(client, token)
    notif_id = create_res.json()["id"]
    res = client.delete(f"/notifications/{notif_id}", headers=auth_header(token))
    assert res.status_code == 200
    assert "deleted" in res.json()["message"].lower()


def test_delete_notification_not_found(client):
    token = get_admin_token(client)
    res = client.delete("/notifications/9999", headers=auth_header(token))
    assert res.status_code == 404


def test_clear_all_notifications_admin(client):
    token = get_admin_token(client)
    _create_notification(client, token)
    _create_notification(client, token)
    res = client.delete("/notifications", headers=auth_header(token))
    assert res.status_code == 200
    assert "cleared_count" in res.json()


def test_clear_all_notifications_viewer_forbidden(client):
    token_admin = get_admin_token(client)
    _create_notification(client, token_admin)

    token_viewer = get_viewer_token(client)
    res = client.delete("/notifications", headers=auth_header(token_viewer))
    assert res.status_code == 403


def test_notification_validation(client):
    token = get_admin_token(client)
    # Missing title
    res = client.post(
        "/notifications",
        json={"message": "No title"},
        headers=auth_header(token),
    )
    assert res.status_code == 422
