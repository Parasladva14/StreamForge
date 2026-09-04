from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.security.jwt import (
    hash_password,
    verify_password,
    create_access_token,
)


def register_user(db: Session, user: UserCreate):
    """
    Register a new user.
    """

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered.")

    # Allowed roles
    allowed_roles = ["Admin", "Operator", "Viewer"]

    role = user.role if user.role in allowed_roles else "Viewer"

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        role=role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(db: Session, user: UserLogin):
    """
    Authenticate user and return JWT token.
    """

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise ValueError("Invalid email or password.")

    if not verify_password(
        user.password,
        existing_user.password,
    ):
        raise ValueError("Invalid email or password.")

    access_token = create_access_token(
        {
            "sub": existing_user.email,
            "role": existing_user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }