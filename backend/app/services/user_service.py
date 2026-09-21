from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.security.jwt import hash_password


def get_all_users(db: Session):
    return db.query(User).all()


def create_user(db: Session, user: UserCreate):
    # Validate role
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


def update_user_role(db: Session, user_id: int, role: str):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return None

    user.role = role

    db.commit()
    db.refresh(user)

    return user


def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return False

    db.delete(user)
    db.commit()

    return True