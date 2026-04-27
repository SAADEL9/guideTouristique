import { createContext, useContext, useState } from "react";
import authService from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());

  const isAuthenticated = !!user;

const hasRole = (role) => {
  if (!user?.roles) return false;
  return user.roles.includes(role) || 
         user.roles.includes(`ROLE_${role.toUpperCase()}`);
};

const isBusiness = () => hasRole('BUSINESS');
const isAdmin = () => hasRole('ADMIN');

 const login = async (username, password) => {
  const response = await authService.login(username, password);
  const data = response.data;

  console.log("Login response:", data);

  const token = data.token || data.accessToken;

  if (!token) {
    console.error("❌ Aucun token reçu !");
    return;
  }

  authService.saveToken(token);

  const userData = {
    id: data.id,
    username: data.username,
    email: data.email,
    roles: data.roles,
  };

  authService.saveUser(userData);
  setUser(userData);

  return data;
};
  const logout = () => {
    authService.removeToken();
    authService.removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated, login, logout,
      hasRole, isBusiness, isAdmin   // ← ajouter ces 3
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);