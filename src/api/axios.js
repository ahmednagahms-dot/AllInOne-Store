import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://e-commerce-api-3wara.vercel.app",
  withCredentials: true,
});

// Request Interceptor -> Add token
api.interceptors.request.use((config) => {
  const token = Cookies.get("store_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor -> Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("store_token");
      Cookies.remove("store_user");

      // Check current path (path or hash)
      const currentUrl = window.location.href.toLowerCase();
      const isAuthPage =
        currentUrl.includes("login") ||
        currentUrl.includes("signup") ||
        currentUrl.includes("forgot");

      // Don't redirect to login if user is already on an auth page
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;