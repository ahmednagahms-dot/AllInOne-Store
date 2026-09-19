import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../components/layout/DashboardLayout";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

export default function Wishlists() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [wishlists, setWishlists] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchWishlists = async () => {
      try {
        setLoading(true);

        const response = await api.get("/wishlists/admin/all");

        if (isMounted) {
          const data = response.data;

          const wishlistsData = Array.isArray(data)
            ? data
            : data?.wishlists || data?.data || [];

          setWishlists(
            Array.isArray(wishlistsData) ? wishlistsData : []
          );
        }
      } catch (error) {
        console.error("Error fetching Wishlists:", error);

        if (isMounted) {
          setWishlists([]);

          toast.error("Failed to load Wishlists.", {
            toastId: "wishlists-fetch-error",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWishlists();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("wishlists.loading") || "Loading wishlists..."} />
      ) : (
        <div className="animate-fade-in w-full page-surface">
          <div className="min-h-screen bg-[#f5f7fa] p-6 page-surface">
            {/* Header */}
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
              <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-primary-600">
                {t("navigation.wishlists") || "WISHLISTS"}
              </p>

              <h1 className="mb-2 text-2xl font-bold text-gray-900">
                {t("wishlists.title") || "Wishlists overview"}
              </h1>

              <p className="text-sm text-gray-500">
                {t("wishlists.description") ||
                  "All active wishlists returned from the API are rendered here with their latest item details."}
              </p>
            </div>

            {/* Empty State */}
            {wishlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12">
                <h2 className="text-lg font-semibold text-gray-400">
                  {t("wishlists.empty") || "No wishlists found"}
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {wishlists.map((item, index) => {
                  const productsList = item.products || item.items || [];
                  const userDetail =
                    typeof item.user === "object"
                      ? item.user?.email || item.user?.name || "N/A"
                      : item.user || "N/A";

                  return (
                    <div
                      key={item._id || index}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">
                          Wishlist #{index + 1}
                        </h3>
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                          {productsList.length} Items
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-xs text-gray-500">
                        <p className="mb-1">
                          <span className="font-medium text-gray-700">User:</span>{" "}
                          {userDetail}
                        </p>
                        {item._id && (
                          <p className="truncate font-mono text-[10px] text-gray-400">
                            ID: {item._id}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}