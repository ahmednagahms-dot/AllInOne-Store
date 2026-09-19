import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

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
      setError("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await cancelMyOrder(orderId);
      toast.success("Order cancelled");
      await fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
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
        <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-gray-500 max-w-sm">We couldn't load your orders.</p>
        <button
          onClick={fetchOrders}
          className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.key
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
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
              ? "You haven't placed any orders yet"
              : "No orders with this status"}
          </h2>
          <p className="text-gray-500 max-w-sm">
            Products you order will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-2 px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            Explore Products
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
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      Order #{order._id?.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-US")
                        : ""}{" "}
                      · {items.length}{" "}
                      {items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_TABS.find((t) => t.key === status)?.label || status}
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
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="text-sm text-danger hover:underline disabled:opacity-50"
                      >
                        {cancellingId === order._id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-sm text-primary-500 font-medium hover:underline"
                    >
                      View Order
                      <ChevronRight size={14} />
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