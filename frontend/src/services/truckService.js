import api from "../api/api";

/**
 * Get all trucks
 */
export const getTrucks = async () => {
  const response = await api.get("/truck/");
  return response.data;
};

/**
 * Get single truck by ID
 */
export const getTruckById = async (id) => {
  const response = await api.get(`/truck/${id}`);
  return response.data;
};

/**
 * Create new truck
 */
export const addTruck = async (truck) => {
  const response = await api.post("/truck/", truck);
  return response.data;
};

/**
 * Update truck
 */
export const updateTruck = async (id, truck) => {
  const response = await api.put(`/truck/${id}`, truck);
  return response.data;
};

/**
 * Delete truck
 */
export const deleteTruck = async (id) => {
  const response = await api.delete(`/truck/${id}`);
  return response.data;
};

/**
 * Search trucks by keyword (Frontend Search)
 */
export const searchTrucks = (trucks, keyword) => {
  if (!keyword) return trucks;

  const search = keyword.toLowerCase();

  return trucks.filter(
    (truck) =>
      truck.truck_id?.toLowerCase().includes(search) ||
      truck.driver_name?.toLowerCase().includes(search) ||
      truck.location?.toLowerCase().includes(search) ||
      truck.status?.toLowerCase().includes(search)
  );
};

/**
 * Filter trucks by status
 */
export const filterByStatus = (trucks, status) => {
  if (!status || status === "All") return trucks;

  return trucks.filter((truck) => truck.status === status);
};