// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// export default function MainLayout() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 antialiased transition-colors duration-200">
//       <Navbar />

//       <main className="flex-grow">
//         <Outlet />
//       </main>

//       <Footer />
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Spinner from "../ui/Spinner";

export default function MainLayout() {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation(); // بيلقط إنت في أنهي صفحة دلوقتي

  useEffect(() => {
    // 1. أول ما المسار يتغير (أو الصفحة تفتح لأول مرة)، شغل اللودنج
    setIsPageLoading(true);

    // 2. بنعمل سكرول لفوق أوتوماتيك عشان الصفحة الجديدة تفتح من أولها
    window.scrollTo({ top: 0, behavior: "instant" });

    // 3. بنوقف اللودنج بعد 500 ملي ثانية (نص ثانية) عشان يدي تأثير سلس
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 500);

    // تنظيف التايمر عشان ميعملش مشاكل في الأداء
    return () => clearTimeout(timer);
  }, [location.pathname]); // 👈 السحر هنا: الكود ده بيشتغل كل ما الرابط يتغير

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      {/* لو الـ State بـ true، اعرض شاشة اللودنج اللي بتغطي الموقع */}
      {isPageLoading && <Spinner fullScreen={true} />}

      {/* المحتوى الأساسي بتاع الصفحات (Shop, Home, Cart, etc...) */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}