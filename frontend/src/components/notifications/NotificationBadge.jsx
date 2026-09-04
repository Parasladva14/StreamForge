import "./NotificationBadge.css";

export default function NotificationBadge({
  unreadCount,
}) {
  return (
    <div className="notification-badge">

      <div className="badge-icon">
        🔔
      </div>

      <div className="badge-content">

        <h2>{unreadCount}</h2>

        <p>Unread Notifications</p>

      </div>

    </div>
  );
}