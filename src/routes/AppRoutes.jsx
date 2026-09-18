import { Routes, Route } from "react-router-dom";
// import Wishlist from "../components/Wishlist";  
import Cart from "../components/ui/Cart";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/cart" element={<Cart />} />
      {/* <Route path="/wishlist" element={<Wishlist />} /> */}
    </Routes>
  )
}