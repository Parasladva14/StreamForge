import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base
from app.database.database import get_db
from app.security.jwt import hash_password, verify_password, create_access_token, decode_access_token
from app.models.user import User

# In-memory SQLite for isolated testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        # Seed test admin, operator, and viewer
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
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_password_hashing():
    raw_password = "securePassword123"
    hashed = hash_password(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("wrongPassword", hashed) is False


def test_jwt_token_generation_and_decoding():
    payload = {"sub": "test@streamforge.com", "role": "Admin"}
    token = create_access_token(payload)
    assert isinstance(token, str)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "test@streamforge.com"
    assert decoded["role"] == "Admin"


def test_login_success(client):
    response = client.post(
        "/auth/login",
        json={"email": "admin@streamforge.com", "password": "admin123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password(client):
    response = client.post(
        "/auth/login",
        json={"email": "admin@streamforge.com", "password": "wrongPassword"},
    )
    assert response.status_code == 401


def test_register_user_success(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "New User",
            "email": "newuser@streamforge.com",
            "password": "newpassword123",
            "role": "Operator",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@streamforge.com"
    assert data["role"] == "Operator"


def test_register_duplicate_email(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "Duplicate Admin",
            "email": "admin@streamforge.com",
            "password": "adminpassword",
            "role": "Admin",
        },
    )
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()


def test_get_me_authenticated(client):
    # Log in
    login_res = client.post(
        "/auth/login",
        json={"email": "admin@streamforge.com", "password": "admin123"},
    )
    token = login_res.json()["access_token"]

    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@streamforge.com"
    assert data["role"] == "Admin"


def test_role_protection_admin_only_routes(client):
    # Viewer tries to access admin-only /users endpoint
    viewer_login = client.post(
        "/auth/login",
        json={"email": "viewer@streamforge.com", "password": "viewer123"},
    )
    viewer_token = viewer_login.json()["access_token"]

    res = client.get(
        "/users",
        headers={"Authorization": f"Bearer {viewer_token}"},
    )
    assert res.status_code == 403

    # Admin accesses /users endpoint
    admin_login = client.post(
        "/auth/login",
        json={"email": "admin@streamforge.com", "password": "admin123"},
    )
    admin_token = admin_login.json()["access_token"]

    res_admin = client.get(
        "/users",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_admin.status_code == 200
    assert len(res_admin.json()) >= 3
