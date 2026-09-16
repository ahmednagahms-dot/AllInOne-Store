import api from "./axios";

// تسجيل الدخول
export const login = (data) => api.post("/auth/login", data);

// تسجيل حساب جديد - خطوة 1 (إرسال OTP)
export const sendRegisterOtp = (data) => api.post("/auth/register/send-otp", data);

// تسجيل حساب جديد - خطوة 2 (تأكيد OTP + إنشاء الحساب)
export const verifyRegisterOtp = (data) => api.post("/auth/register/verify-otp", data);

// نسيت كلمة المرور - إرسال OTP
export const sendForgotPasswordOtp = (data) => api.post("/auth/forgot-password/send-otp", data);

// نسيت كلمة المرور - تأكيد OTP + تغيير الباسورد
export const verifyForgotPasswordOtp = (data) => api.post("/auth/forgot-password/verify-otp", data);

// بيانات المستخدم الحالي
export const getMe = () => api.get("/auth/me");