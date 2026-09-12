from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.notification import Notification


def create_notification(
    db: Session,
    title: str,
    message: str,
    type: str = "info",
    truck_id: Optional[str] = None,
) -> Notification:
    """
    Create and save a new notification.
    """
    notification = Notification(
        title=title,
        message=message,
        type=type,
        is_read=False,
        truck_id=truck_id,
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def get_notifications(db: Session, limit: int = 100) -> List[Notification]:
    """
    Get all notifications ordered by most recent.
    """
    return (
        db.query(Notification)
        .order_by(Notification.created_at.desc())
        .limit(limit)
        .all()
    )


def get_unread_notifications(db: Session) -> List[Notification]:
    """
    Get unread notifications.
    """
    return (
        db.query(Notification)
        .filter(Notification.is_read.is_(False))
        .order_by(Notification.created_at.desc())
        .all()
    )


def get_notification(db: Session, notification_id: int) -> Optional[Notification]:
    """
    Get notification by ID.
    """
    return (
        db.query(Notification)
        .filter(Notification.id == notification_id)
        .first()
    )


def mark_as_read(db: Session, notification_id: int) -> Optional[Notification]:
    """
    Mark single notification as read.
    """
    notification = get_notification(db, notification_id)
    if not notification:
        return None

    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification


def mark_all_as_read(db: Session) -> int:
    """
    Mark all unread notifications as read.
    """
    count = (
        db.query(Notification)
        .filter(Notification.is_read.is_(False))
        .update({"is_read": True})
    )
    db.commit()
    return count


def delete_notification(db: Session, notification_id: int) -> bool:
    """
    Delete notification by ID.
    """
    notification = get_notification(db, notification_id)
    if not notification:
        return False

    db.delete(notification)
    db.commit()
    return True


def clear_all_notifications(db: Session) -> int:
    """
    Delete all notifications.
    """
    count = db.query(Notification).delete()
    db.commit()
    return count
