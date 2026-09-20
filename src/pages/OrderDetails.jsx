import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  PackageX,
  Loader2,
} from "lucide-react";
import { getMyOrderById, cancelMyOrder } from "../api/orders.api";
import { addCartItem } from "../api/cart.api";
import { useAuth } from "../context/AuthContext";

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-600",
  confirmed: "bg-blue-50 text-blue-600",
  processing: "bg-yellow-50 text-yellow-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-600",
  paid: "bg-emerald-50 text-emerald-600",
  unpaid: "bg-amber-50 text-amber-600",
};

function getItemImage(item) {
  const product = item.product || item;
  const img = product.images?.[0];
  if (!img) return product.image || "/Background+Border.svg";
  if (typeof img === "string") return img;
  return img.url || product.image || "/Background+Border.svg";
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [buyingAgain, setBuyingAgain] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyOrderById(id);
      const found = data.order || data.data || data;
      setOrder(found);
    } catch (err) {
      console.error(err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [authLoading, isAuthenticated, fetchOrder, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?"))
      return;
    setCancelling(true);
    try {
      await cancelMyOrder(id);
      toast.success("Order cancelled successfully");
      fetchOrder();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleBuyAgain = async () => {
    if (!order?.items?.length) return;
    setBuyingAgain(true);
    try {
      await Promise.all(
        order.items.map((item) =>
          addCartItem({
            productId:
              item.product?._id ||
              item.productId ||
              item.product ||
              item._id,
            quantity: item.quantity || 1,
          })
        )
      );
      toast.success("Items added to cart");
      navigate("/cart");
    } catch (err) {
      toast.error("Failed to add items to cart");
    } finally {
      setBuyingAgain(false);
    }
  };

  // ===== Loading =====
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // ===== Error =====
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <PackageX className="w-10 h-10 text-red-500" />
        <p className="text-slate-600">{error}</p>
        <button
          onClick={fetchOrder}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ===== Not Found =====
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <PackageX className="w-10 h-10 text-slate-400" />
        <p className="text-slate-600">Order not found</p>
        <Link
          to="/orders"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  const orderNumber = order.orderNumber || order._id;
  const createdAt = order.createdAt || order.date;
  const orderStatus = (order.status || "pending").toLowerCase();
  const paymentStatus = (
    order.isPaid ? "paid" : order.paymentStatus || "unpaid"
  ).toLowerCase();
  const items = order.items || order.products || order.orderItems || [];
  const shippingAddress = order.shippingAddress || order.address || {};
  const paymentMethod = order.paymentMethod || "cash";
  const subtotal = Number(order.subtotal ?? order.itemsPrice ?? 0);
  const discount = Number(order.discount ?? order.discountAmount ?? 0);
  const shippingFee = Number(
    order.shippingFee ?? order.shippingPrice ?? 0
  );
  const total = Number(
    order.totalPrice ??
      order.total ??
      subtotal - discount + shippingFee
  );
  const canCancel = CANCELLABLE_STATUSES.includes(orderStatus);
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> My Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Order #{orderNumber?.slice?.(-6)?.toUpperCase() || orderNumber}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
              STATUS_STYLES[paymentStatus] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {paymentStatus}
          </span>
          <span
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
              STATUS_STYLES[orderStatus] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {orderStatus}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          Items ({items.length})
        </h2>
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const product = item.product || item;
            const lineTotal =
              (item.price || product.price || 0) *
              (item.quantity || 1);
            return (
              <div
                key={item._id || idx}
                className="flex items-center gap-4 py-4"
              >
                <img
                  src={getItemImage(item)}
                  alt={product.name || "product"}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "/Background+Border.svg";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {product.name || "Product"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Qty: {item.quantity || 1}
                  </p>
                </div>
                <p className="font-semibold text-slate-900 shrink-0">
                  ${lineTotal.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Shipping Address
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {shippingAddress.fullName ||
              shippingAddress.name ||
              "-"}
            <br />
            {shippingAddress.address || shippingAddress.street || ""}
            {shippingAddress.city ? `, ${shippingAddress.city}` : ""}
            <br />
            {shippingAddress.country || ""}{" "}
            {shippingAddress.postalCode
              ? ` - ${shippingAddress.postalCode}`
              : ""}
            <br />
            {shippingAddress.phone || ""}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" /> Payment
          </h2>
          <p className="text-sm text-slate-600 capitalize mb-4">
            {paymentMethod === "cash"
              ? "Cash on Delivery"
              : paymentMethod}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span>
                {shippingFee > 0
                  ? `$${shippingFee.toFixed(2)}`
                  : "Free"}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canCancel && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2.5 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
        <button
          onClick={handleBuyAgain}
          disabled={buyingAgain || items.length === 0}
          className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {buyingAgain ? "Adding..." : "Buy Again"}
        </button>
      </div>
    </div>
  );
}