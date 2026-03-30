import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      let token = sessionStorage.getItem("token") || localStorage.getItem("token");
      let savedUser = sessionStorage.getItem("user") || localStorage.getItem("user");

      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        return { ...parsedUser, token };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userEmail");
    setUser(null);
    window.location.href = "/";
  };

  // Auto-logout при изтекъл/невалиден JWT (401 от сървъра)
  useEffect(() => {
    const handleUnauthorized = () => {
      // Само ако потребителят е влязъл — избягваме loop на публични страници
      if (sessionStorage.getItem("token") || localStorage.getItem("token")) {
        logout();
      }
    };
    window.addEventListener('musclemap:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('musclemap:unauthorized', handleUnauthorized);
  }, []);

  const login = (token, userData, rememberMe = false) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);

    const userWithToken = { ...userData, token };
    storage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const updateUser = (data) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updated));
      }
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);