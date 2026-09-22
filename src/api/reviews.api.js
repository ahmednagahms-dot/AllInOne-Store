import api from "./axios";

export const getAllReviews = (params) => api.get("/reviews", { params });

export const getProductReviews = (productId) =>
  api.get(`/products/${productId}/reviews`);