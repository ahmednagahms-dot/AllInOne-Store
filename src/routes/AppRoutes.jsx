import { Routes, Route } from "react-router-dom";
import OrderDetails from "../pages/profile/OrderDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div >ALLINONE STORE</div>} />
      <Route path="/profile/orders/:id" element={<OrderDetails />} />
    </Routes>
  );
}