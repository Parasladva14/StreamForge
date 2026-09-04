import "./NotificationFilter.css";

export default function NotificationFilter({
  filter,
  setFilter,
}) {
  return (
    <div className="notification-filter">

      <label>
        Filter Notifications
      </label>

      <select
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="all">
          All
        </option>

        <option value="unread">
          Unread
        </option>

        <option value="read">
          Read
        </option>

        <option value="critical">
          Critical
        </option>

        <option value="warning">
          Warning
        </option>

        <option value="success">
          Success
        </option>

        <option value="info">
          Info
        </option>

      </select>

    </div>
  );
}