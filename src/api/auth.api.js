import api from "./axios";

export const login = (payload) => api.post("/auth/login", payload);

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");

export const registerSendOtp = (payload) => api.post("/auth/register/send-otp", payload);

export const registerVerifyOtp = (payload) => api.post("/auth/register/verify-otp", payload);


export const forgotPasswordSendOtp = (payload) => api.post("/auth/forgot-password/send-otp", payload);

export const forgotPasswordVerifyOtp = (payload) => api.post("/auth/forgot-password/verify-otp", payload);

export const changeRole = (payload) => api.patch("/auth/change-role", payload);

// بيانات المستخدم الحالي
export const getMe = () => api.get("/auth/me");

export const updateProfile = (data) => api.patch("/auth/me", data);

// تغيير كلمة المرور وانت داخل حسابك - إرسال OTP للإيميل
export const sendChangePasswordOtp = () => api.post("/auth/change-password/send-otp");

// تغيير كلمة المرور - تأكيد OTP + كلمة المرور الجديدة
export const verifyChangePasswordOtp = (data) =>
  api.post("/auth/change-password/verify-otp", data);

