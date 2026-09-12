from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.roles import require_role
from app.schemas.notification import NotificationCreate, NotificationResponse
from app.services.notification_service import (
    create_notification,
    get_notifications,
    get_unread_notifications,
    get_notification,
    mark_as_read,
    mark_all_as_read,
    delete_notification,
    clear_all_notifications,
)
from app.websocket.manager import manager

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("", response_model=List[NotificationResponse])
def read_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    return get_notifications(db)


@router.get("/unread", response_model=List[NotificationResponse])
def read_unread_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    return get_unread_notifications(db)


@router.get("/{id}", response_model=NotificationResponse)
def read_single_notification(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    notification = get_notification(db, id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return notification


@router.post("", response_model=NotificationResponse, status_code=201)
async def create_new_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator")),
):
    notif = create_notification(
        db=db,
        title=data.title,
        message=data.message,
        type=data.type,
        truck_id=data.truck_id,
    )
    await manager.broadcast(
        {
            "id": notif.id,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type,
            "is_read": notif.is_read,
            "truck_id": notif.truck_id,
            "created_at": notif.created_at.isoformat() if notif.created_at else None,
        },
        channel="notifications",
    )
    return notif


@router.patch("/{id}/read", response_model=NotificationResponse)
def mark_notification_read(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    notification = mark_as_read(db, id)
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return notification


@router.patch("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator", "Viewer")),
):
    updated_count = mark_all_as_read(db)
    return {
        "message": "All notifications marked as read",
        "updated_count": updated_count,
    }


@router.delete("/{id}")
def remove_notification(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Operator")),
):
    success = delete_notification(db, id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )
    return {"message": "Notification deleted successfully", "id": id}


@router.delete("")
def clear_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin")),
):
    cleared_count = clear_all_notifications(db)
    return {
        "message": "All notifications cleared successfully",
        "cleared_count": cleared_count,
    }
