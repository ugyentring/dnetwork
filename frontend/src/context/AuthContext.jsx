import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getProfile } from "../services/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await getProfile(token);
          setUser(userData);
        }
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { user, token } = await loginUser(credentials);
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/");
  };

  const register = async (userData) => {
    const { user, token } = await registerUser(userData);
    localStorage.setItem("token", token);
    setUser(user);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
