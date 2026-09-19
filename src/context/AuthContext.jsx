import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // عند فتح الموقع: نقرأ التوكن ونجيب بيانات المستخدم
  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get("store_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getMe();
        const userData = data.user || data;
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        Cookies.remove("store_token");
        Cookies.remove("store_user");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ===== تسجيل الدخول (مهم جدًا) =====
  const loginUser = (token, userData) => {
    Cookies.set("store_token", token, { expires: 7 });

    if (userData) {
      Cookies.set("store_user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
    }

    setIsAuthenticated(true); // ← ده اللي بيخلي الـ Navbar يتحدث فورًا
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

  const value = {
    user,
    isAuthenticated,
    loading,
    loginUser,
    logoutUser,
    updateUser,
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