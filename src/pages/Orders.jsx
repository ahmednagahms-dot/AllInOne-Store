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

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  processing: "bg-yellow-50 text-yellow-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
};

function getOrderItems(order) {
  return order.items || order.products || order.orderItems || [];
}

function getOrderTotal(order) {
  return (
    order.totalPrice ??
    order.total ??
    order.totalAmount ??
    0
  );
}

function getOrderStatus(order) {
  return (order.status || "pending").toLowerCase();
}

function getOrderImage(item) {
  const product = item.product || item;
  const img = product.images?.[0];
  if (!img) return product.image || "/Background+Border.svg";
  if (typeof img === "string") return img;
  return img.url || product.image || "/Background+Border.svg";
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
      const list =
        data.orders ||
        data.data?.orders ||
        data.data ||
        data ||
        [];
      setOrders(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(err);
      setError(
        t("orders.loadOrdersFailed") || "Failed to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (orderId) => {
    const confirmMsg =
      t("orders.cancelConfirm") ||
      "Are you sure you want to cancel this order?";
    if (!window.confirm(confirmMsg)) return;

    setCancellingId(orderId);
    try {
      await cancelMyOrder(orderId);
      toast.success(
        t("orders.orderCancelledSuccess") || "Order cancelled"
      );
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          t("orders.orderCancelFailed") ||
          "Failed to cancel order"
      );
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
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // ===== Error State =====
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("orders.errorTitle") || "Something went wrong"}
        </h2>
        <p className="text-gray-500 max-w-sm">
          {t("orders.errorSubtitle") ||
            "We couldn't load your orders."}
        </p>
        <button
          onClick={fetchOrders}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          {t("orders.tryAgain") || "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t("orders.title") || "My Orders"}
        </h1>
        <p className="text-gray-500 mt-1">
          {t("orders.orderCount", { count: orders.length }) ||
            `${orders.length} ${
              orders.length === 1 ? "order" : "orders"
            }`}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t(`orders.tabs.${tab.key}`, {
              defaultValue: tab.label,
            })}
          </button>
        ))}
      </div>

      {/* ===== Empty State ===== */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
            <Package className="text-blue-600" size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab === "all"
              ? t("orders.emptyTitle") ||
                "You haven't placed any orders yet"
              : t("orders.emptyFilterTitle") ||
                "No orders with this status"}
          </h2>
          <p className="text-gray-500 max-w-sm">
            {t("orders.emptySubtitle") ||
              "Products you order will appear here."}
          </p>
          <Link
            to="/shop"
            className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {t("orders.exploreProducts") || "Explore Products"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const items = getOrderItems(order);
            const status = getOrderStatus(order);
            const canCancel =
              status === "pending" || status === "confirmed";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t("orders.orderNumber") || "Order #"}
                      {order._id?.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            isArabic ? "ar-EG" : "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : ""}{" "}
                      ·{" "}
                      {t("orders.itemCount", { count: items.length }) ||
                        `${items.length} ${
                          items.length === 1 ? "item" : "items"
                        }`}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
                      STATUS_STYLES[status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t(`orders.tabs.${status}`, {
                      defaultValue: status,
                    })}
                  </span>
                </div>

                {/* Item thumbnails */}
                {items.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {items.slice(0, 4).map((item, idx) => (
                      <div
                        key={item._id || idx}
                        className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0"
                      >
                        <img
                          src={getOrderImage(item)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/Background+Border.svg";
                          }}
                        />
                      </div>
                    ))}
                    {items.length > 4 && (
                      <span className="text-xs text-gray-400 ml-1">
                        +{items.length - 4} more
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
                        className="text-sm text-red-600 hover:underline disabled:opacity-50 font-medium cursor-pointer"
                      >
                        {cancellingId === order._id
                          ? t("orders.cancelling") || "Cancelling..."
                          : t("orders.cancelOrder") || "Cancel Order"}
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline"
                    >
                      {t("orders.viewOrder") || "View Order"}
                      <ChevronRight
                        size={14}
                        className="rtl:rotate-180"
                      />
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