import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // Our Gateway!
});

// This interceptor will automatically add the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
