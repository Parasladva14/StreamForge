import { jwtDecode } from "jwt-decode";

export const getDecodedToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    // Check if token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("access_token");
      return null;
    }
    return decoded;
  } catch (error) {
    localStorage.removeItem("access_token");
    return null;
  }
};

export const getUserRole = () => {
  const decoded = getDecodedToken();
  return decoded?.role || null;
};

export const getUserEmail = () => {
  const decoded = getDecodedToken();
  return decoded?.sub || null;
};

export const isTokenValid = () => {
  return getDecodedToken() !== null;
};