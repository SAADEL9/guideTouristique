import axiosInstance from './AxiosInstance';

const ReviewService = {
  // Reviews
  getReviews: (establishmentId, establishmentType) =>
    axiosInstance.get('/reviews', { params: { establishmentId, establishmentType } }),

  createReview: (review) =>
    axiosInstance.post('/reviews', review),

  getFlaggedReviews: () =>
    axiosInstance.get('/reviews/flagged'),

  updateReviewStatus: (id, status) =>
    axiosInstance.put(`/reviews/${id}/status`, null, { params: { status } }),

  addOwnerReply: (id, reply) =>
    axiosInstance.put(`/reviews/${id}/owner-reply`, null, { params: { reply } }),

  voteHelpful: (id) =>
    axiosInstance.put(`/reviews/${id}/helpful`),

  voteNotHelpful: (id) =>
    axiosInstance.put(`/reviews/${id}/not-helpful`),

  flagReview: (id) =>
    axiosInstance.put(`/reviews/${id}/flag`),

  deleteReview: (id) =>
    axiosInstance.delete(`/reviews/${id}`),

  // Questions & Answers
  getQuestions: (establishmentId, establishmentType) =>
    axiosInstance.get('/questions', { params: { establishmentId, establishmentType } }),

  createQuestion: (question) =>
    axiosInstance.post('/questions', question),

  addAnswer: (questionId, answer) =>
    axiosInstance.post(`/questions/${questionId}/answers`, answer),

  deleteQuestion: (id) =>
    axiosInstance.delete(`/questions/${id}`),

  deleteAnswer: (questionId, answerId) =>
    axiosInstance.delete(`/questions/${questionId}/answers/${answerId}`),
};

export default ReviewService;
