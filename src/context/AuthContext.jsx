import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";

import { getMe, login as loginApi, logout as logoutApi } from "../api/auth.api";

import { getMe, updateProfile } from "../api/auth.api";


const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const saved = Cookies.get("allinone_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    const token = Cookies.get("allinone_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await getMe();
      setUser(data.user);
      Cookies.set("allinone_user", JSON.stringify(data.user), { expires: 7, sameSite: "strict" });
    } catch (err) {
      setUser(null);
      Cookies.remove("allinone_user");
      Cookies.remove("allinone_token");
    } finally {
      setLoading(false);
    }
  };
=======
 
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


  useEffect(() => {
    fetchSession();
  }, []);


  const loginUser = async (payload) => {
    const { data } = await loginApi(payload);
    Cookies.set("allinone_token", data.token, { expires: 7, sameSite: "strict" });
    await fetchSession();
    return data;

  // ===== تسجيل الدخول =====
  const loginUser = (token, userData) => {
    Cookies.set("store_token", token, { expires: 7 });

    if (userData) {
      Cookies.set("store_user", JSON.stringify(userData), { expires: 7 });
      setUser(userData);
    }

    setIsAuthenticated(true);

  };

  const logoutUser = async () => {
    try {
      await logoutApi();
    } catch (err) {
      
    } finally {
      Cookies.remove("allinone_user");
      Cookies.remove("allinone_token");
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    Cookies.set("allinone_user", JSON.stringify(userData), { expires: 7, sameSite: "strict" });
  };


  const value = useMemo(
    () => ({
      user,
      loading,
      loginUser,
      logoutUser,
      updateUser,
      refreshUser: fetchSession,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

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
  return useContext(AuthContext);
}