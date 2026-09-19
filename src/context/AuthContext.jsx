import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMe, updateProfile } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 
  const [user, setUser] = useState(() => {
    try {
      const cached = Cookies.get("store_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!Cookies.get("store_token")
  );

  const [loading, setLoading] = useState(true);

  // عند فتح الموقع: نتأكد من التوكن ونجيب أحدث بيانات المستخدم
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("store_token");
      if (!token) {
        setLoading(false);
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      try {
        const { data } = await getMe();
        const userData = data.user || data;
        setUser(userData);
        setIsAuthenticated(true);
        // خزّن أحدث نسخة في الـ cookies
        Cookies.set("store_user", JSON.stringify(userData), { expires: 7 });
      } catch {
        Cookies.remove("store_token");
        Cookies.remove("store_user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ===== تسجيل الدخول =====
  const loginUser = (token, userData) => {
    Cookies.set("store_token", token, { expires: 7 });

    if (userData) {
      Cookies.set("store_user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
    }

    setIsAuthenticated(true);
  };

  // ===== تسجيل الخروج =====
  const logoutUser = () => {
    Cookies.remove("store_token");
    Cookies.remove("store_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // تحديث بيانات المستخدم محليًا
  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      Cookies.set("store_user", JSON.stringify(updated), { expires: 7 });
      return updated;
    });
  };

  // تعديل بيانات البروفايل فعليًا عبر الـ API
  const updateProfileData = async (data) => {
    const res = await updateProfile(data);
    const updatedUser = res.data.user || res.data;
    updateUser(updatedUser);
    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    loginUser,
    logoutUser,
    updateUser,
    updateProfileData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}