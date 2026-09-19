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
<<<<<<< HEAD
=======

export const updateProfile = (data) => api.patch("/auth/me", data);

// تغيير كلمة المرور وانت داخل حسابك - إرسال OTP للإيميل
export const sendChangePasswordOtp = () => api.post("/auth/change-password/send-otp");

// تغيير كلمة المرور - تأكيد OTP + كلمة المرور الجديدة
export const verifyChangePasswordOtp = (data) =>
  api.post("/auth/change-password/verify-otp", data);
>>>>>>> bea2942cca817471a2d0b8fbfd0ca66fb8142fc3
