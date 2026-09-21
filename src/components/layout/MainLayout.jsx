import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Spinner from "../ui/Spinner";

export default function MainLayout() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);

    window.scrollTo({ top: 0, behavior: "instant" });

    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased transition-colors duration-200">
      <Navbar />

      {isPageLoading && <Spinner fullScreen={true} />}

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}