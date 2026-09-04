import api from "../api/api";

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/");
    return response.data;
};

export const getRecentTrucks = async () => {
    const response = await api.get("/truck/recent");
    return response.data;
};

export const getAlerts = async () => {
    const response = await api.get("/alerts/");
    return response.data;
};