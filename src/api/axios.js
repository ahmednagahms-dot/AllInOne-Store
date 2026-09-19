import axios from "axios";
import Cookies from "js-cookie";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials : true,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("allinone_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message.status === 401) {
      Cookies.remove("allinone_token");
      Cookies.remove("allinone_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.history.replaceState(null,"","/login") 


      }
    }
    return Promise.reject(error);
  }
);

export default api;