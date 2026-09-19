import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function Coupons() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [Coupons, setCoupons] = useState([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchCoupons = async () => {
      try {
        const response = await api.get("/Coupons");

        setCoupons(
          Array.isArray(response.data)
            ? response.data
            : response.data?.Coupons || response.data?.data || [],
        );
      } catch (error) {
        console.error("Error fetching Coupons:", error);
        toast.error("Failed to load Coupons.");
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("coupons.loading")} />
      ) : (
        <div className="animate-fade-in w-full page-surface">
          <div className="p-6 bg-[#f5f7fa] min-h-screen page-surface">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <p className="text-xs tracking-[0.3em] text-primary-600 font-semibold mb-2">
                {t("navigation.coupons")}
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t("coupons.title")}
              </h1>
              <p className="text-gray-500 text-sm">
                {t("coupons.description")}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  {t("coupons.loading")}
                </h2>
              </div>
            )}

            {/* Empty */}
            {!loading && Coupons.length === 0 && (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  {t("coupons.empty")}
                </h2>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
