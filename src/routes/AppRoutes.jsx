import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

// Auth
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgetPassword from "../components/auth/ForgetPassword";
import VerifyOtp from "../components/auth/VerifyOtp";

// Pages
import Home from "../pages/Home";
import Cart from "../pages/Cart";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Auth (بدون Navbar / Footer) ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ===== الصفحات العادية (مع Navbar + Footer) ===== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}