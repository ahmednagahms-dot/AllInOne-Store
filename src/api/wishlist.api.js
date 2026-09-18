import api from "./axios";

export const addToWishlist = (productId) => api.post(`/wishlists/add/${productId}`);
export const removeFromWishlist = (productId) => api.delete(`/wishlists/remove/${productId}`);
export const getMyWishlist = () => api.get("/wishlists/my");
export const clearWishlist = () => api.delete("/wishlists/clear");