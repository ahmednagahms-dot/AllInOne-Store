import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Products from "./pages/Home"; // أو مكان صفحة المنتجات لديك
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", display: "flex", gap: "15px" }}>
        <Link to="/">المنتجات</Link>
        <Link to="/wishlist">قائمة الرغبات</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </div>
  );
}

export default App;