import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Our Gateway!
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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Force redirect
    }
    return Promise.reject(error);
  },
);
