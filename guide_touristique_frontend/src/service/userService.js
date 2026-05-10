import axiosInstance from "../api/AxiosInstance";

export const userService = {
  getFavorites() {
    return axiosInstance.get("/users/favorites");
  },

  getFavoriteIds() {
    return axiosInstance.get("/users/favorites/ids");
  },

  addFavorite(tourId) {
    return axiosInstance.post(`/users/favorites/${tourId}`);
  },

  removeFavorite(tourId) {
    return axiosInstance.delete(`/users/favorites/${tourId}`);
  },

  getReviewStats(establishmentId, establishmentType) {
    return axiosInstance.get(`/reviews/stats/${establishmentId}/${establishmentType}`);
  },
};

export default userService;
