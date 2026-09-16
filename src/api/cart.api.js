import api from "./axios";

export const getCart = () => api.get("/carts");
export const addCartItem = (data) => api.post("/carts/items", data);
export const updateCartItem = (data) => api.patch("/carts/items", data);
export const removeCartItem = (productId) => api.delete(`/carts/items/${productId}`);
export const applyCoupon = (data) => api.post("/carts/coupon", data);
export const removeCoupon = () => api.delete("/carts/coupon");
export const clearCart = () => api.delete("/carts/clear");