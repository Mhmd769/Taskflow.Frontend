import axios from "axios";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "https://localhost:55358/api", // Match your backend Swagger exactly
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // usually false for JWT
});

// Optional: intercept requests to add token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
