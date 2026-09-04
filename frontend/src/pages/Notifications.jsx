import { useEffect, useMemo, useState, useCallback } from "react";

import notificationService from "../services/notificationService";
import useNotifications from "../hooks/useNotifications";

import NotificationBadge from "../components/notifications/NotificationBadge";
import NotificationToolbar from "../components/notifications/NotificationToolbar";
import NotificationFilter from "../components/notifications/NotificationFilter";
import NotificationList from "../components/notifications/NotificationList";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [filter, setFilter] = useState("all");

  // ==========================
  // Load Notifications
  // ==========================

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await notificationService.getNotifications();

      setNotifications(data || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ==========================
  // Real-Time Notifications
  // ==========================

  useNotifications((newNotification) => {

    setNotifications((prev) => {

      // Prevent duplicate notifications
      const exists = prev.some(
        (item) => item.id === newNotification.id
      );

      if (exists) return prev;

      return [
        newNotification,
        ...prev,
      ];

    });

  });

  // ==========================
  // Mark Single Notification Read
  // ==========================

  async function handleMarkRead(id) {
    try {
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                is_read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  // ==========================
  // Mark All Notifications Read
  // ==========================

  async function handleMarkAllRead() {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications:",
        error
      );
    }
  }

  // ==========================
  // Unread Count
  // ==========================

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.is_read
    ).length;
  }, [notifications]);

  // ==========================
  // Filter Notifications
  // ==========================

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      switch (filter) {
        case "unread":
          return !notification.is_read;

        case "read":
          return notification.is_read;

        case "critical":
          return notification.type === "critical";

        case "warning":
          return notification.type === "warning";

        case "success":
          return notification.type === "success";

        case "info":
          return notification.type === "info";

        default:
          return true;
      }
    });
  }, [notifications, filter]);

  return (
    <div
      style={{
        background: "#111827",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      {/* Page Title */}
      <h1
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        🔔 Notifications
      </h1>

      {/* Notification Badge */}
      <NotificationBadge
        unreadCount={unreadCount}
      />

      {/* Toolbar */}
      <NotificationToolbar
        unreadCount={unreadCount}
        onRefresh={loadNotifications}
        onMarkAllRead={handleMarkAllRead}
      />

      {/* Filter */}
      <NotificationFilter
        filter={filter}
        setFilter={setFilter}
      />

      {/* Notification List */}
      {loading ? (
        <div
          style={{
            color: "white",
            textAlign: "center",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          Loading Notifications...
        </div>
      ) : (
        <NotificationList
          notifications={filteredNotifications}
          onMarkRead={handleMarkRead}
        />
      )}
    </div>
  );
}