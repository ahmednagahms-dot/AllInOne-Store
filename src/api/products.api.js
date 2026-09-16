import api from "./axios";

export const getProducts = (params) => api.get("/products", { params });
export const searchProducts = (params) => api.get("/products/search", { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getProductReviews = (id) => api.get(`/products/${id}/reviews`);
export const addProductReview = (id, data) => api.post(`/products/${id}/reviews`, data);