import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedAccess = localStorage.getItem("access");
        const savedRefresh = localStorage.getItem("refresh");

        if (savedAccess) {
          setAccess(savedAccess);
          setRefresh(savedRefresh);

          try {
            const data = await getUserProfile(savedAccess);
            setUser(data);
          } catch (err) {
            console.error("Error obteniendo perfil:", err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error inicializando auth:", err);
        setUser(null);
      } finally {
        setLoading(false);
        setIsReady(true); 
      }
    };

    initAuth();
  }, []);

  const isAuthenticated = !!access;

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    setAccess(accessToken);
    setRefresh(refreshToken);

    (async () => {
      try {
        const data = await getUserProfile(accessToken);
        setUser(data);
      } catch (err) {
        console.error("Error obteniendo perfil:", err);
        setUser(null);
      }
    })();
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setAccess(null);
    setRefresh(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      access,
      refresh,
      isAuthenticated,
      user,
      login,
      logout,
      loading,
      isReady,
    }),
    [access, refresh, isAuthenticated, user, loading, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
