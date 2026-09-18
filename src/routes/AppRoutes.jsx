import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";




export default function AppRoutes() {
  return (
    <Routes>
      


      {/* الصفحات اللي جواها Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
           
      </Route>
    </Routes>
  );
}