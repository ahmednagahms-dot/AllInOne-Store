import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب الجلسة عند فتح الموقع
  const fetchSession = async () => {
    const savedToken = Cookies.get("store_token");
    const savedUser = Cookies.get("store_user");

    if (!savedToken) {
      setLoading(false);
      return;
    }

    try {
      setToken(savedToken);

      // نجرب نجيب البيانات من الـ API عشان نتأكد إن التوكن لسه صالح
      const { data } = await getMe();
      setUser(data.user || data);

      // نحدث الكوكي لو في تغيير
      Cookies.set("store_user", JSON.stringify(data.user || data), { expires: 7 });
    } catch (error) {
      // التوكن بايظ → نمسحه
      Cookies.remove("store_token");
      Cookies.remove("store_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // تسجيل الدخول
  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    Cookies.set("store_token", authToken, { expires: 7 });
    Cookies.set("store_user", JSON.stringify(userData), { expires: 7 });
  };

  // تسجيل الخروج
  const logoutUser = () => {
    setUser(null);
    setToken(null);

    Cookies.remove("store_token");
    Cookies.remove("store_user");
  };

  // تحديث بيانات المستخدم
  const updateUser = (newUserData) => {
    setUser(newUserData);
    Cookies.set("store_user", JSON.stringify(newUserData), { expires: 7 });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    loginUser,
    logoutUser,
    updateUser,
    fetchSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook للاستخدام
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}