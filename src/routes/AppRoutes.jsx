import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";
import ForgetPassword from "../components/auth/ForgetPassword";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot" element={<ForgetPassword />} />
      <Route path="/forgot-password" element={<ForgetPassword />} />
    </Routes>
  );
}