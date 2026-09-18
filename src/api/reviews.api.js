import api from "./axios";

// كل المراجعات (endpoint عام)
export const getAllReviews = (params) => api.get("/reviews", { params });

// مراجعات منتج معين
export const getProductReviews = (productId) =>
  api.get(`/products/${productId}/reviews`);