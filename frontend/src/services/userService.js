import api from "../api/api";

export const getUsers = async () => {
    const response = await api.get("/users");
    return response.data;
};

export const createUser = async (user) => {
    const response = await api.post("/users", user);
    return response.data;
};

export const updateUserRole = async (id, role) => {
    const response = await api.put(`/users/${id}/role`, {
        role,
    });

    return response.data;
};

export const deleteUser = async (id) => {
    await api.delete(`/users/${id}`);
};