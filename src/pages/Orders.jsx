import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getMyOrders, cancelMyOrder } from "../api/orders.api";
import { toast } from "react-toastify";
import {
  Loader2,
  AlertTriangle,
  Package,
  ChevronRight,
} from "lucide-react";

const STATUS_KEYS = ["all", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES = {
  processing: "bg-warning/10 text-warning",
  shipped: "bg-primary-50 text-primary-600",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

function getOrderItems(order) {
  return order.items || order.products || [];
}

function getOrderTotal(order) {
  return order.total ?? order.totalPrice ?? order.totalAmount ?? 0;
}

function getOrderStatus(order) {
  return (order.status || "processing").toLowerCase();
}

export default function Orders() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyOrders();
      const list = data.orders || data.data || data || [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError(t("orders.loadOrdersFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm(t("orders.cancelConfirm"))) return;
    setCancellingId(orderId);
    try {
      await cancelMyOrder(orderId);
      toast.success(t("orders.orderCancelledSuccess"));
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(t("orders.orderCancelFailed"));
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((o) => getOrderStatus(o) === activeTab);

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  // ===== Error State =====
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
          <AlertTriangle className="text-danger" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t("orders.errorTitle")}</h2>
        <p className="text-gray-500 max-w-sm">{t("orders.errorSubtitle")}</p>
        <button
          onClick={fetchOrders}
          className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition cursor-pointer"
        >
          {t("orders.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t("orders.title")}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("orders.orderCount", { count: orders.length })}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === key
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t(`orders.tabs.${key}`)}
          </button>
        ))}
      </div>

      {/* ===== Empty State ===== */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
            <Package className="text-primary-500" size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab === "all"
              ? t("orders.emptyTitle")
              : t("orders.emptyFilterTitle")}
          </h2>
          <p className="text-gray-500 max-w-sm">
            {t("orders.emptySubtitle")}
          </p>
          <Link
            to="/shop"
            className="mt-2 px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            {t("orders.exploreProducts")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const items = getOrderItems(order);
            const status = getOrderStatus(order);
            const canCancel = status === "processing";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t("orders.orderNumber")}{order._id?.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            isArabic ? "ar-EG" : "en-US"
                          )
                        : ""}{" "}
                      · {t("orders.itemCount", { count: items.length })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t(`orders.tabs.${status}`, { defaultValue: status })}
                  </span>
                </div>

                {/* Item thumbnails */}
                {items.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {items.slice(0, 4).map((item, idx) => {
                      const product = item.product || item;
                      const img =
                        product.images?.[0]?.url ||
                        product.image ||
                        "https://via.placeholder.com/60?text=No+Image";
                      return (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100"
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    })}
                    {items.length > 4 && (
                      <span className="text-xs text-gray-400">
                        +{items.length - 4}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <p className="font-bold text-gray-900">
                    ${getOrderTotal(order).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3">
                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="text-sm text-danger hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {cancellingId === order._id
                          ? t("orders.cancelling")
                          : t("orders.cancelOrder")}
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-sm text-primary-500 font-medium hover:underline"
                    >
                      {t("orders.viewOrder")}
                      <ChevronRight size={14} className="rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}