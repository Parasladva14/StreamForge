import api from "./api";

const mapService = {
  async getTruckLocations() {
    try {
      const response = await api.get("/trucks/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching truck locations:", error);
      throw error;
    }
  },
};

export default mapService;