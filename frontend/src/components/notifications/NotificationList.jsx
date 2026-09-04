import NotificationCard from "./NotificationCard";
import "./NotificationList.css";

export default function NotificationList({
  notifications,
  onMarkRead,
}) {
  if (!notifications.length) {
    return (
      <div className="notification-empty">
        <div className="empty-icon">🔔</div>

        <h2>No Notifications</h2>

        <p>
          Everything looks good.
          There are no notifications right now.
        </p>
      </div>
    );
  }

  return (
    <div className="notification-list">

      {notifications.map((notification) => (

        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
        />

      ))}

    </div>
  );
}