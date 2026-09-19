import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

// Auth
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgetPassword from "../components/auth/ForgetPassword";
import VerifyOtp from "../components/auth/VerifyOtp";

// Pages
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";
import OrderDetails from "../pages/OrderDetails";
import Orders from "../pages/Orders"; 

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== Auth ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot" element={<ForgetPassword />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ===== Regular pages ===== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        {/* Orders */}
        <Route path="/orders" element={<Orders />} />             
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
}