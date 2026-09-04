import api from "./api";

const notificationService = {
  // ==========================
  // Get All Notifications
  // ==========================
  async getNotifications() {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // ==========================
  // Get Unread Notifications
  // ==========================
  async getUnreadNotifications() {
    try {
      const response = await api.get("/notifications/unread");
      return response.data;
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      throw error;
    }
  },

  // ==========================
  // Get Notification By ID
  // ==========================
  async getNotificationById(id) {
    try {
      const response = await api.get(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notification:", error);
      throw error;
    }
  },

  // ==========================
  // Mark Single Notification Read
  // ==========================
  async markAsRead(id) {
    try {
      const response = await api.patch(
        `/notifications/${id}/read`
      );

      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // ==========================
  // Mark All Notifications Read
  // ==========================
  async markAllAsRead() {
    try {
      const response = await api.patch(
        "/notifications/read-all"
      );

      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // ==========================
  // Delete Notification
  // ==========================
  async deleteNotification(id) {
    try {
      const response = await api.delete(
        `/notifications/${id}`
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // ==========================
  // Clear All Notifications
  // ==========================
  async clearAllNotifications() {
    try {
      const response = await api.delete(
        "/notifications"
      );

      return response.data;
    } catch (error) {
      console.error("Error clearing notifications:", error);
      throw error;
    }
  },
};

export default notificationService;