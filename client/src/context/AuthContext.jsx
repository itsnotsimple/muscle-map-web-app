import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      
      if (token && savedUser) {
        // ВЗИМАМЕ ПОТРЕБИТЕЛЯ И МУ "ЗАЛЕПЯМЕ" ТОКЕНА, ЗА ДА ГО ИМА
        const parsedUser = JSON.parse(savedUser);
        return { ...parsedUser, token }; 
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  // --- ПОПРАВЕНАТА LOGIN ФУНКЦИЯ ---
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    
    // ВАЖНО: Сливане на данните!
    // Слагаме токена ВЪТРЕ в user обекта, преди да го запазим
    const userWithToken = { ...userData, token };
    
    localStorage.setItem("user", JSON.stringify(userWithToken));
    setUser(userWithToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setUser(null);
    window.location.href = "/";
  };

  const updateUser = (data) => {
    setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        localStorage.setItem("user", JSON.stringify(updated)); 
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