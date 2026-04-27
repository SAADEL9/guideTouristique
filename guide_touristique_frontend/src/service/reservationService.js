import axiosInstance from "../api/AxiosInstance";

export const reservationService = {
  createReservation({ tourId, date, numberOfPeople }) {
    return axiosInstance.post("/reservations", { tourId, date, numberOfPeople });
  },

  getMyReservations() {
    return axiosInstance.get("/reservations/my");
  },

  getTourReservations(tourId) {
    return axiosInstance.get(`/reservations/tour/${tourId}`);
  },

  updateReservationStatus(id, status) {
    return axiosInstance.put(`/reservations/${id}/status`, null, {
      params: { status },
    });
  },
};

export default reservationService;
