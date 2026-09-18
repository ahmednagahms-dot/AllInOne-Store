import { Routes, Route } from "react-router-dom";
import ShoppingCart from "../components/ui/Cart.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>ALLINONE STORE</div>} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/shop" element={<div>Shop Page</div>} />
    </Routes>
  );
}