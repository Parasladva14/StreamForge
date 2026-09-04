import axios from "axios";

// ================================
// Create Axios Instance
// ================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// Request Interceptor
// ================================
api.interceptors.request.use(
  (config) => {

    // Read JWT from localStorage
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `➡ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ================================
// Response Interceptor
// ================================
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`
    );

    return response;
  },

  (error) => {

    if (error.response) {

      console.error("Response Error");
      console.error("Status :", error.response.status);
      console.error("Message :", error.response.data);

      switch (error.response.status) {

        case 400:
          console.error("Bad Request");
          break;

        case 401:
          console.error("Unauthorized");

          // Remove invalid token
          localStorage.removeItem("access_token");

          break;

        case 403:
          console.error("Forbidden");
          break;

        case 404:
          console.error("API Not Found");
          break;

        case 500:
          console.error("Internal Server Error");
          break;

        default:
          console.error("Unknown API Error");
      }

    } else if (error.request) {

      console.error("Server not responding.");

    } else {

      console.error("Axios Error:", error.message);

    }

    return Promise.reject(error);
  }
);

export default api;