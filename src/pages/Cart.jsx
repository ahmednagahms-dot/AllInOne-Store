import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { addToWishlist } from "../api/wishlist.api";
import { toast } from "react-toastify";
import Button from "../components/ui/Button";
import {
  Loader2,
  Minus,
  Plus,
  Trash2,
  Heart,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Headphones,
  AlertTriangle,
  Tag,
  X,
  ArrowRight,
} from "lucide-react";

// Extract product data from cart item
function getItemProduct(item) {
  return item.product && typeof item.product === "object"
    ? item.product
    : item;
}

function getItemImage(item) {
  const product = getItemProduct(item);
  return (
    product.images?.[0]?.url ||
    product.image ||
    "https://placehold.co/150x150?text=No+Image"
  );
}

function getItemId(item) {
  return (
    item.productId ||
    item.product?._id ||
    item.product ||
    item._id
  );
}

export default function Cart() {
  const { t } = useTranslation();
  const {
    cart,
    loading,
    error,
    fetchCart,
    updateItem,
    removeItem,
    applyCartCoupon,
    removeCartCoupon,
    clearAllCart, // ✅ fixed name
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  const items = cart?.items || cart?.products || [];

  const subtotal = items.reduce((sum, item) => {
    const product = getItemProduct(item);
    const price = product.discountPrice ?? product.price ?? 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const discount = cart?.discount ?? cart?.couponDiscount ?? 0;
  const total =
    cart?.total ?? cart?.totalPriceAfterDiscount ?? subtotal - discount;
  const appliedCoupon = cart?.coupon || cart?.appliedCoupon;

  const handleQuantityChange = async (item, nextQty) => {
    if (nextQty < 1) return;
    const id = getItemId(item);
    setBusyItemId(id);
    await updateItem(id, nextQty);
    setBusyItemId(null);
  };

  const handleRemove = async (item) => {
    const id = getItemId(item);
    setBusyItemId(id);
    await removeItem(id);
    setBusyItemId(null);
  };

  const handleMoveToWishlist = async (item) => {
    const id = getItemId(item);
    setBusyItemId(id);
    try {
      await addToWishlist(id);
      await removeItem(id);
      toast.success(t("cart.movedToWishlist"));
    } catch (err) {
      console.error(err);
      toast.error(t("cart.moveToWishlistFailed"));
    } finally {
      setBusyItemId(null);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const ok = await applyCartCoupon(couponCode.trim());
    setCouponLoading(false);
    if (ok) setCouponCode("");
  };

  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    await removeCartCoupon();
    setCouponLoading(false);
  };

  const handleClearCart = async () => {
    if (!window.confirm(t("cart.clearCartConfirm")))
      return;
    await clearAllCart(); // ✅ fixed call
  };

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
        <h2 className="text-xl font-bold text-gray-900">{t("cart.errorTitle")}</h2>
        <p className="text-gray-500 max-w-sm">
          {t("cart.errorSubtitle")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={fetchCart}
            className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
          >
            {t("cart.tryAgain")}
          </button>
          <Link
            to="/shop"
            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            {t("cart.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center">
          <ShoppingBag className="text-primary-500" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t("cart.emptyTitle")}</h2>
        <p className="text-gray-500 max-w-sm">
          {t("cart.emptySubtitle")}
        </p>
        <Link
          to="/shop"
          className="mt-2 px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  // ===== Cart with items =====
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {t("cart.title")}
        </h1>
        <p className="text-gray-500 mt-1">{t("cart.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Items List ===== */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {t("cart.itemsCount", { count: items.length })}
            </p>
            <button
              onClick={handleClearCart}
              className="text-sm text-danger hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} />
              {t("cart.clearCart")}
            </button>
          </div>

          {items.map((item) => {
            const product = getItemProduct(item);
            const id = getItemId(item);
            const isBusy = busyItemId === id;
            const price = product.discountPrice ?? product.price ?? 0;
            const originalPrice = product.discountPrice ? product.price : null;

            return (
              <div
                key={id}
                className={`flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 transition ${
                  isBusy ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  to={`/product/${id}`}
                  className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50"
                >
                  <img
                    src={getItemImage(item)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${id}`}
                        className="font-medium text-gray-900 hover:text-primary-500 line-clamp-1"
                      >
                        {product.name || t("cart.productFallback")}
                      </Link>
                      {product.category && (
                        <p className="text-xs text-gray-400 capitalize mt-0.5">
                          {product.category}
                        </p>
                      )}
                    </div>
                    <div className="text-left rtl:text-right shrink-0">
                      <p className="font-bold text-gray-900">
                        ${(price * (item.quantity || 1)).toFixed(2)}
                      </p>
                      {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          $
                          {(originalPrice * (item.quantity || 1)).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(item, (item.quantity || 1) - 1)
                        }
                        disabled={(item.quantity || 1) <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item, (item.quantity || 1) + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-xs text-gray-500 hover:text-primary-500 flex items-center gap-1"
                      >
                        <Heart size={14} />
                        {t("cart.moveToWishlist")}
                      </button>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-xs text-danger hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Order Summary ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-5">{t("cart.orderSummary")}</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t("cart.subtotal")}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{t("cart.discount")}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 my-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>{t("cart.total")}</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>

            {/* Coupon */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-success/10 text-success text-sm px-3 py-2.5 rounded-lg mb-4">
                <span className="flex items-center gap-2">
                  <Tag size={14} />
                  {t("cart.couponApplied", { code: appliedCoupon.code || appliedCoupon })}
                </span>
                <button onClick={handleRemoveCoupon} disabled={couponLoading}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t("cart.couponPlaceholder")}
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {couponLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    t("cart.applyCoupon")
                  )}
                </button>
              </form>
            )}

            <Button
              onClick={() => navigate("/checkout")}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <span>{t("cart.proceedToCheckout")}</span>
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Button>

            <Link
              to="/shop"
              className="w-full flex items-center justify-center text-sm text-gray-500 hover:text-primary-500 mt-3"
            >
              {t("cart.continueShopping")}
            </Link>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="text-primary-500" size={18} />
                <span className="text-[11px] text-gray-500">
                  {t("cart.securePayment")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="text-primary-500" size={18} />
                <span className="text-[11px] text-gray-500">{t("cart.easyReturns")}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Headphones className="text-primary-500" size={18} />
                <span className="text-[11px] text-gray-500">{t("cart.support")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}