import axiosInstance from "../api/AxiosInstance";

const login = (username, password) => {
  return axiosInstance.post("/auth/signin", { username, password });
};

const register = (username, email, password) => {
  return axiosInstance.post("/auth/signup", { username, email, password });
};

const saveToken = (token) => localStorage.setItem("token", token);
const getToken = () => localStorage.getItem("token");
const removeToken = () => localStorage.removeItem("token");

const saveUser = (user) => localStorage.setItem("user", JSON.stringify(user));
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const removeUser = () => localStorage.removeItem("user");

const authService = {
  login,
  register,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
};

export default authService;