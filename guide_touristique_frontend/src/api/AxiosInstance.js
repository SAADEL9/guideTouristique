import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Ajouter automatiquement le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Gérer erreurs sans logout automatique (debug safe)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log("❌ API ERROR:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        console.warn("Unauthorized → vérifie ton backend/token");
        // ⚠️ NE PAS logout automatiquement pendant debug
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;