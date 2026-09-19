import { createContext, useContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { getMe, login as loginApi, logout as logoutApi } from "../api/auth.api";

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

  useEffect(() => {
    fetchSession();
  }, []);

  const loginUser = async (payload) => {
    const { data } = await loginApi(payload);
    Cookies.set("allinone_token", data.token, { expires: 7, sameSite: "strict" });
    await fetchSession();
    return data;
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}