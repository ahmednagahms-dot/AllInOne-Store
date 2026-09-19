import { useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import SessionLoader from "../ui/sessionLoader/SessionLoader";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { loading } = useAuth();

  return (
    <>
      {loading && <SessionLoader />}
      <div className="bg-surface-alt min-h-screen relative overflow-x-hidden transition-colors">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        <div
          className={`fixed inset-y-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            isArabic ? "right-0" : "left-0"
          } ${
            sidebarOpen
              ? "translate-x-0"
              : isArabic
                ? "translate-x-full lg:translate-x-0"
                : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        <div className={isArabic ? "lg:mr-64" : "lg:ml-64"}>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </>
  );
}
