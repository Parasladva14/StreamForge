import "./NotificationToolbar.css";

export default function NotificationToolbar({
  unreadCount,
  onRefresh,
  onMarkAllRead,
}) {
  return (
    <div className="notification-toolbar">

      <div className="toolbar-info">

        <h3>Notification Center</h3>

        <p>
          {unreadCount} Unread Notification
          {unreadCount !== 1 ? "s" : ""}
        </p>

      </div>

      <div className="toolbar-actions">

        <button
          className="mark-all-btn"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          ✓ Mark All Read
        </button>

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          ↻ Refresh
        </button>

      </div>

    </div>
  );
}