import { Routes, Route } from "react-router-dom";
import OrderDetails from "../pages/profile/OrderDetails";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Shop from "../pages/Shop";



import MainLayout from "../components/layout/MainLayout";

// Auth
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgetPassword from "../components/auth/ForgetPassword";
import VerifyOtp from "../components/auth/VerifyOtp";

// Pages
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import ProductDetail from "../pages/ProductDetail";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<div >ALLINONE STORE</div>} />
      <Route path="/profile/orders/:id" element={<OrderDetails />} />

      {/* ===== Auth (no Navbar / Footer) ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot" element={<ForgetPassword />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* ===== Regular pages (with Navbar + Footer) ===== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/shop" element={<Shop />} />
        

        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/shop" element={<div>Shop Page</div>} />

      </Route>

    </Routes>
  );
}