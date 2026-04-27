import axiosInstance from "../api/AxiosInstance";

export const adminService = {
  getPendingTours() {
    return axiosInstance.get("/tours/pending");
  },

  updateTourStatus(id, status) {
    return axiosInstance.put(`/tours/${id}/status`, null, {
      params: { status },
    });
  },
};

export default adminService;
