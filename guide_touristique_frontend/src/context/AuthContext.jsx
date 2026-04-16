import { createContext, useContext, useState } from "react";
import authService from "../service/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());

  const isAuthenticated = !!user;

  const login = async (username, password) => {
    const response = await authService.login(username, password);
    const data = response.data;

    authService.saveToken(data.token);
    authService.saveUser({
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    });

    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      roles: data.roles,
    });

    return data;
  };

  const logout = () => {
    authService.removeToken();
    authService.removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);