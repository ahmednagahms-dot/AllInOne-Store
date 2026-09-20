import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ArrowLeft, MapPin, CreditCard, PackageX, Loader2 } from "lucide-react";
import { getMyOrderById, cancelMyOrder } from "../api/orders.api";
import { addCartItem } from "../api/cart.api";
import { useAuth } from "../context/AuthContext";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

export default function OrderDetails() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

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
      setError(t("orderDetails.loadError"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchOrder();
  }, [authLoading, isAuthenticated, fetchOrder, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm(t("orderDetails.cancelConfirm"))) return;
    setCancelling(true);
    try {
      await cancelMyOrder(id);
      toast.success(t("orderDetails.cancelSuccess"));
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || t("orderDetails.cancelError"));
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
            productId: item.product?._id || item.productId || item._id,
            quantity: item.quantity || 1,
          })
        )
      );
      toast.success(t("orderDetails.buyAgainSuccess"));
      navigate("/cart");
    } catch (err) {
      toast.error(t("orderDetails.buyAgainError"));
    } finally {
      setBuyingAgain(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <PackageX className="w-10 h-10 text-danger" />
        <p className="text-slate-600">{error}</p>
        <button
          onClick={fetchOrder}
          className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 cursor-pointer"
        >
          {t("orderDetails.tryAgain")}
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <PackageX className="w-10 h-10 text-slate-400" />
        <p className="text-slate-600">{t("orderDetails.notFound")}</p>
        <Link
          to="/orders"
          className="text-primary-600 text-sm font-medium hover:underline"
        >
          {t("orderDetails.backToOrders")}
        </Link>
      </div>
    );
  }

  const orderNumber = order.orderNumber || order._id;
  const createdAt = order.createdAt || order.date;
  const orderStatus = order.status;
  const paymentStatus = order.isPaid ? "paid" : order.paymentStatus || "unpaid";
  const items = order.items || order.products || [];
  const shippingAddress = order.shippingAddress || order.address || {};
  const paymentMethod = order.paymentMethod || "cash";
  const subtotal = Number(order.subtotal ?? order.itemsPrice ?? 0);
  const discount = Number(order.discount ?? order.discountAmount ?? 0);
  const shippingFee = Number(order.shippingFee ?? order.shippingPrice ?? 0);
  const total = Number(
    order.total ?? order.totalPrice ?? subtotal - discount + shippingFee
  );
  const canCancel = CANCELLABLE_STATUSES.includes(
    String(orderStatus).toLowerCase()
  );
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{t("orderDetails.backToOrders")}</span>
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("orderDetails.orderTitle", { number: orderNumber })}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{formattedDate}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={paymentStatus} />
          <OrderStatusBadge status={orderStatus} />
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-slate-900 mb-4">
          {t("orderDetails.itemsTitle", { count: items.length })}
        </h2>
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const product = item.product || item;
            const image =
              product.images?.[0]?.url ||
              product.images?.[0] ||
              product.image ||
              "/placeholder.png";
            const lineTotal =
              (item.price || product.price || 0) * (item.quantity || 1);
            return (
              <div
                key={item._id || idx}
                className="flex items-center gap-4 py-4"
              >
                <img
                  src={image}
                  alt={product.name || "product"}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {product.name || "Product"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {t("orderDetails.quantity")} {item.quantity || 1}
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

      {/* Shipping & Payment Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>{t("orderDetails.shippingAddress")}</span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {shippingAddress.fullName || shippingAddress.name || "-"}
            <br />
            {shippingAddress.street || shippingAddress.address || ""}
            {shippingAddress.city ? `, ${shippingAddress.city}` : ""}
            <br />
            {shippingAddress.phone || ""}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary-500" />
            <span>{t("orderDetails.payment")}</span>
          </h2>
          <p className="text-sm text-slate-600 capitalize mb-4">
            {paymentMethod === "cash"
              ? t("orderDetails.cashOnDelivery")
              : paymentMethod}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>{t("orderDetails.subtotal")}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>{t("orderDetails.discount")}</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>{t("orderDetails.shipping")}</span>
              <span>
                {shippingFee > 0
                  ? `$${shippingFee.toFixed(2)}`
                  : t("orderDetails.freeShipping")}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-100">
              <span>{t("orderDetails.total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="px-4 py-2.5 rounded-lg border border-danger text-danger text-sm font-medium hover:bg-danger/5 disabled:opacity-50 cursor-pointer"
          >
            {cancelling
              ? t("orderDetails.cancelling")
              : t("orderDetails.cancelOrder")}
          </button>
        )}
        <button
          type="button"
          onClick={handleBuyAgain}
          disabled={buyingAgain || items.length === 0}
          className="px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 cursor-pointer"
        >
          {buyingAgain
            ? t("orderDetails.adding")
            : t("orderDetails.buyAgain")}
        </button>
      </div>
    </div>
  );
}