import { Routes, Route } from "react-router-dom";
import ProductDetail from "../pages/ProductDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div >ALLINONE STORE</div>} />
          <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  );
}
