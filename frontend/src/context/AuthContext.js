// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (token && user) {
          const decodedToken = jwtDecode(token);
          const isExpired = decodedToken.exp * 1000 < Date.now();
          if (isExpired) {
            logout();
            return;
          }
          setCurrentUser(JSON.parse(user));
        }
      } catch (err) {
        setError("خطا در بارگذاری اطلاعات احراز هویت");
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (user, token) => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) throw new Error("توکن منقضی شده است");
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      setError("خطا در ورود: " + err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};