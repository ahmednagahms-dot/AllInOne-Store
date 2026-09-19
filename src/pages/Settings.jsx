import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <DashboardLayout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("pages.settings") || "Settings"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400">
          {t("pages.storeConfiguration") || "Store configuration."}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs p-8 flex flex-col items-center text-center max-w-md mx-auto transition-colors">
        {/* Store Logo Container */}
        <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-700 p-2 flex items-center justify-center mb-4 shadow-xs">
          <img
            src={STORE_LOGO_URL}
            alt="AllInOne Store"
            className="w-full h-full object-contain rounded-xl"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-2">
          {t("pages.settingsSoon") || "Store settings coming soon"}
        </h3>

        {/* Description info */}
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300 flex items-start gap-2 text-left rtl:text-right bg-slate-50/70 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700">
          <Info size={18} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
          <span>
            {t("pages.settingsDescription") ||
              "Store-level configuration (name, logo, shipping, taxes) requires a dedicated backend endpoint that doesn't exist yet. To manage your personal account, visit your"}{" "}
            <Link
              to="/dashboard/profile"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold underline"
            >
              {t("pages.profilePage") || "Profile page"}
            </Link>
            .
          </span>
        </p>
      </div>
    </DashboardLayout>
  );
}