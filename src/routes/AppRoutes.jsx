import { Routes, Route } from "react-router-dom";
import ProductDetail from "../pages/ProductDetail";

import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgetPassword from "../components/auth/ForgetPassword";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";




import ShoppingCart from "../components/ui/Cart.jsx";


export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<div >ALLINONE STORE</div>} />
          <Route path="/products/:id" element={<ProductDetail />} />


      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot" element={<ForgetPassword />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
      


      {/* الصفحات اللي جواها Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
           
      </Route>

      <Route path="/" element={<div>ALLINONE STORE</div>} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/shop" element={<div>Shop Page</div>} />


    </Routes>
  );
}
