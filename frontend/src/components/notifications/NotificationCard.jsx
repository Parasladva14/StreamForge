import "./NotificationCard.css";

export default function NotificationCard({
  notification,
  onMarkRead,
}) {

  const getIcon = () => {
    switch (notification.type) {
      case "critical":
        return "🚨";

      case "warning":
        return "⚠️";

      case "success":
        return "✅";

      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`notification-card ${
        notification.is_read ? "read" : "unread"
      }`}
    >
      <div className="notification-header">

        <div className="notification-title">

          <span className="notification-icon">
            {getIcon()}
          </span>

          <h3>{notification.title}</h3>

        </div>

        <span
          className={`status ${
            notification.is_read
              ? "read-status"
              : "unread-status"
          }`}
        >
          {notification.is_read
            ? "Read"
            : "Unread"}
        </span>

      </div>

      <p className="notification-message">
        {notification.message}
      </p>

      <div className="notification-footer">

        <span className="notification-time">
          🕒{" "}
          {new Date(
            notification.created_at
          ).toLocaleString()}
        </span>

        {!notification.is_read && (
          <button
            className="mark-read-btn"
            onClick={() =>
              onMarkRead(notification.id)
            }
          >
            Mark as Read
          </button>
        )}

      </div>

    </div>
  );
}