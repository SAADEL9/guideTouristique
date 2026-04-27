import axiosInstance from "../api/AxiosInstance";

export const tourService = {
  getApprovedTours() {
    return axiosInstance.get("/tours");
  },

  getTourById(id) {
    return axiosInstance.get(`/tours/${id}`);
  },

  getMyTours() {
    return axiosInstance.get("/tours/my-tours");
  },

  createTour(tour) {
    return axiosInstance.post("/tours", tour);
  },

  updateTour(id, tour) {
    return axiosInstance.put(`/tours/${id}`, tour);
  },

  deleteTour(id) {
    return axiosInstance.delete(`/tours/${id}`);
  },

  updateTourStatus(id, status) {
    return axiosInstance.put(`/tours/${id}/status`, null, {
      params: { status },
    });
  },

  getPendingTours() {
    return axiosInstance.get("/tours/pending");
  },
};

export default tourService;
