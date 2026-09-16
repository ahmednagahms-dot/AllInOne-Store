import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getMyOrderById = (id) => api.get(`/orders/my/${id}`);
export const cancelMyOrder = (id) => api.patch(`/orders/my/${id}/cancel`);