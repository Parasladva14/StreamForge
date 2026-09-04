import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {

    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role;
    } catch (error) {
        return null;
    }

};

export const getUserEmail = () => {

    const token = localStorage.getItem("access_token");

    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.sub;
    } catch (error) {
        return null;
    }

};