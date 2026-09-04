import api from "../api/api";

export const analyticsService = {
  // Dashboard Summary
  async getDashboardSummary() {
    const response = await api.get("/analytics/summary");
    return response.data;
  },

  // Temperature Trend
  async getTemperatureTrend() {
    const response = await api.get("/analytics/temperature-trend");
    return response.data;
  },

  // Truck Status Distribution
  async getStatusDistribution() {
    const response = await api.get("/analytics/status-distribution");
    return response.data;
  },

  // Location Distribution
  async getLocationDistribution() {
    const response = await api.get("/analytics/location-distribution");
    return response.data;
  },

  // Recent Trucks
  async getRecentTrucks() {
    const response = await api.get("/truck/recent");
    return response.data;
  },

  // Recent Alerts
  async getRecentAlerts() {
    const response = await api.get("/alerts");
    return response.data;
  }
};