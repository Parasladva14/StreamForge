"""
Tests for Dashboard and Analytics API endpoints.
"""
import pytest
from app.tests.conftest import get_admin_token, get_viewer_token, auth_header
from app.models.truck import Truck
from app.models.alert import Alert


def _seed_trucks(db_session):
    """Seed test trucks for analytics tests."""
    trucks = [
        Truck(
            truck_id="TRK-A-001", driver_name="Alice",
            location="Mumbai", temperature=25.0, status="Active",
            latitude=19.076, longitude=72.877, speed=60.0, fuel=80.0,
        ),
        Truck(
            truck_id="TRK-A-002", driver_name="Bob",
            location="Delhi", temperature=35.0, status="Active",
            latitude=28.613, longitude=77.209, speed=50.0, fuel=60.0,
        ),
        Truck(
            truck_id="TRK-A-003", driver_name="Charlie",
            location="Bangalore", temperature=15.0, status="Inactive",
            latitude=12.971, longitude=77.594, speed=0.0, fuel=90.0,
        ),
        Truck(
            truck_id="TRK-A-004", driver_name="Diana",
            location="Pune", temperature=42.0, status="Maintenance",
            latitude=18.520, longitude=73.856, speed=0.0, fuel=30.0,
        ),
    ]
    db_session.add_all(trucks)
    db_session.commit()


def _seed_alerts(db_session):
    """Seed test alerts."""
    alerts = [
        Alert(truck_id="TRK-A-001", temperature=45.0, level="Critical", message="Overheating"),
        Alert(truck_id="TRK-A-002", temperature=38.0, level="Warning", message="High temp"),
        Alert(truck_id="TRK-A-004", temperature=50.0, level="Critical", message="Critical temp"),
    ]
    db_session.add_all(alerts)
    db_session.commit()


# =====================================================
# Dashboard API Tests
# =====================================================


def test_dashboard_endpoint(client, db_session):
    _seed_trucks(db_session)
    token = get_admin_token(client)
    res = client.get("/dashboard/", headers=auth_header(token))
    assert res.status_code == 200
    data = res.json()
    assert "total_trucks" in data
    assert "average_temperature" in data
    assert "highest_temperature" in data
    assert "lowest_temperature" in data
    assert "alert_count" in data


def test_dashboard_counts(client, db_session):
    _seed_trucks(db_session)
    token = get_admin_token(client)
    res = client.get("/dashboard/", headers=auth_header(token))
    data = res.json()
    assert data["total_trucks"] >= 4
    assert data["highest_temperature"] >= 42.0


def test_dashboard_unauthenticated(client):
    res = client.get("/dashboard/")
    assert res.status_code in (401, 403, 422)


# =====================================================
# Analytics API Tests
# =====================================================


def test_analytics_summary(client, db_session):
    _seed_trucks(db_session)
    _seed_alerts(db_session)
    token = get_admin_token(client)
    res = client.get("/analytics/summary", headers=auth_header(token))
    assert res.status_code == 200
    data = res.json()
    assert "total_trucks" in data
    assert "highest_temperature" in data
    assert "average_temperature" in data
    assert "critical_alerts" in data


def test_analytics_temperature_values(client, db_session):
    _seed_trucks(db_session)
    _seed_alerts(db_session)
    token = get_admin_token(client)
    res = client.get("/analytics/summary", headers=auth_header(token))
    data = res.json()
    assert data["highest_temperature"] >= 42.0
    assert data["average_temperature"] > 0
    assert data["critical_alerts"] >= 2


def test_analytics_viewer_access(client, db_session):
    _seed_trucks(db_session)
    token = get_viewer_token(client)
    res = client.get("/analytics/summary", headers=auth_header(token))
    assert res.status_code == 200


def test_analytics_empty_db(client):
    token = get_admin_token(client)
    res = client.get("/analytics/summary", headers=auth_header(token))
    assert res.status_code == 200
    data = res.json()
    assert data["total_trucks"] == 0
    assert data["highest_temperature"] == 0.0
    assert data["average_temperature"] == 0.0
