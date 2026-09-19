import { Routes, Route } from "react-router-dom";
import ShoppingCart from "../pages/Cart.jsx";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";

export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      <Route path="/cart" element={<ShoppingCart />} />
      </Route>
    </Routes>
  );
}