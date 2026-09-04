import api from "./api";

const geofenceService = {
  // Get all geofences
  async getGeofences() {
    const response = await api.get("/geofences");

    return response.data;
  },

  // Get one geofence
  async getGeofence(id) {
    const response = await api.get(`/geofences/${id}`);

    return response.data;
  },

  // Create geofence
  async createGeofence(data) {
    const response = await api.post(
      "/geofences",
      data
    );

    return response.data;
  },

  // Update geofence
  async updateGeofence(id, data) {
    const response = await api.put(
      `/geofences/${id}`,
      data
    );

    return response.data;
  },

  // Delete geofence
  async deleteGeofence(id) {
    const response = await api.delete(
      `/geofences/${id}`
    );

    return response.data;
  },
};

export default geofenceService;