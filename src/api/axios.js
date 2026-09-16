import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://e-commerce-api-3wara.vercel.app",
 withCredentials : true,
});

// Request Interceptor → إضافة التوكن
api.interceptors.request.use((config) => {
  const token = Cookies.get("store_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor → التعامل مع 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("store_token");
      Cookies.remove("store_user");

      // نروح لصفحة اللوجين بس لو مش فيها أصلاً
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;