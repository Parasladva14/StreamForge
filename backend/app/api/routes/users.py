from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.user import (
    UserCreate,
    UserRoleUpdate,
    UserResponse,
)

from app.services.user_service import (
    get_all_users,
    create_user,
    update_user_role,
    delete_user,
)

from app.dependencies.roles import require_role

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "",
    response_model=list[UserResponse],
)
def list_users(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):
    return get_all_users(db)


@router.post(
    "",
    response_model=UserResponse,
)
def add_user(
    user: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):
    return create_user(db, user)


@router.put(
    "/{user_id}/role",
    response_model=UserResponse,
)
def change_role(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):

    user = update_user_role(
        db,
        user_id,
        data.role,
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return user


@router.delete("/{user_id}")
def remove_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):

    success = delete_user(db, user_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "message": "User deleted successfully"
    }