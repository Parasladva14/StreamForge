from sqlalchemy.orm import Session

from app.models.alert import Alert


def create_alert(
    db: Session,
    truck_id: str,
    temperature: float,
    level: str,
    message: str,
):
    """
    Create and save a new alert.
    """

    alert = Alert(
        truck_id=truck_id,
        temperature=temperature,
        level=level,
        message=message,
    )

    db.add(alert)
    db.commit()
    db.refresh(alert)

    return alert


def get_recent_alerts(db: Session, limit: int = 20):
    """
    Return latest alerts.
    """

    return (
        db.query(Alert)
        .order_by(Alert.created_at.desc())
        .limit(limit)
        .all()
    )


def get_alert_count(db: Session):
    """
    Return total number of alerts.
    """

    return db.query(Alert).count()


def get_critical_alert_count(db: Session):
    """
    Return total critical alerts.
    """

    return (
        db.query(Alert)
        .filter(Alert.level == "Critical")
        .count()
    )


def delete_old_alerts(db: Session, keep_last: int = 100):
    """
    Keep only the latest alerts.
    """

    alerts = (
        db.query(Alert)
        .order_by(Alert.created_at.desc())
        .all()
    )

    if len(alerts) <= keep_last:
        return

    for alert in alerts[keep_last:]:
        db.delete(alert)

    db.commit()