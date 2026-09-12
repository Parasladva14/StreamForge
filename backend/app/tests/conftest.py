"""
Shared test fixtures for the StreamForge backend test suite.
Provides isolated in-memory SQLite session, test client, and auth helpers.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.database import get_db
from app.security.jwt import hash_password, create_access_token
from app.models.user import User


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh in-memory DB with seeded users for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        admin = User(
            username="Admin",
            email="admin@streamforge.com",
            password=hash_password("admin123"),
            role="Admin",
        )
        operator = User(
            username="Operator",
            email="operator@streamforge.com",
            password=hash_password("operator123"),
            role="Operator",
        )
        viewer = User(
            username="Viewer",
            email="viewer@streamforge.com",
            password=hash_password("viewer123"),
            role="Viewer",
        )
        db.add_all([admin, operator, viewer])
        db.commit()
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """FastAPI test client with DB override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def get_admin_token(client) -> str:
    """Helper to obtain an admin JWT for authenticated requests."""
    res = client.post(
        "/auth/login",
        json={"email": "admin@streamforge.com", "password": "admin123"},
    )
    return res.json()["access_token"]


def get_operator_token(client) -> str:
    """Helper to obtain an operator JWT."""
    res = client.post(
        "/auth/login",
        json={"email": "operator@streamforge.com", "password": "operator123"},
    )
    return res.json()["access_token"]


def get_viewer_token(client) -> str:
    """Helper to obtain a viewer JWT."""
    res = client.post(
        "/auth/login",
        json={"email": "viewer@streamforge.com", "password": "viewer123"},
    )
    return res.json()["access_token"]


def auth_header(token: str) -> dict:
    """Return Authorization header dict."""
    return {"Authorization": f"Bearer {token}"}
