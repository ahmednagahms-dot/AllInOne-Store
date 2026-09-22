import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
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
    clearAllCart,
  } = useCart();

  const { isInWishlist, toggleItem: toggleWishlistItem } = useWishlist();

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

  const handleToggleWishlist = async (item) => {
    const id = getItemId(item);
    setBusyItemId(id);
    await toggleWishlistItem(id);
    setBusyItemId(null);
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
    await clearAllCart();
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
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t("cart.errorTitle")}</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          {t("cart.errorSubtitle")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={fetchCart}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-400 transition cursor-pointer"
          >
            {t("cart.tryAgain")}
          </button>
          <Link
            to="/shop"
            className="px-6 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
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
        <div className="w-20 h-20 rounded-full bg-blue-600 dark:bg-blue-950/50 flex items-center justify-center">
          <ShoppingBag className="text-white dark:text-blue-600" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">{t("cart.emptyTitle")}</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          {t("cart.emptySubtitle")}
        </p>
        <Link
          to="/shop"
          className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-400 transition"
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
          {t("cart.title")}
        </h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">{t("cart.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Items List ===== */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {t("cart.itemsCount", { count: items.length })}
            </p>
            <button
              onClick={handleClearCart}
              className="text-sm text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
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
                className={`flex gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 transition shadow-sm ${
                  isBusy ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Link
                  to={`/product/${id}`}
                  className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800"
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
                        className="font-medium text-gray-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-600 line-clamp-1"
                      >
                        {product.name || t("cart.productFallback")}
                      </Link>
                      {product.category && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 capitalize mt-0.5">
                          {product.category}
                        </p>
                      )}
                    </div>
                    <div className="text-left rtl:text-right shrink-0">
                      <p className="font-bold text-gray-900 dark:text-slate-100">
                        ${(price * (item.quantity || 1)).toFixed(2)}
                      </p>
                      {originalPrice && (
                        <p className="text-xs text-gray-400 dark:text-slate-500 line-through">
                          $
                          {(originalPrice * (item.quantity || 1)).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      <button
                        onClick={() =>
                          handleQuantityChange(item, (item.quantity || 1) - 1)
                        }
                        disabled={(item.quantity || 1) <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-40 cursor-pointer"
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
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleWishlist(item)}
                        className={`text-xs flex items-center gap-1 cursor-pointer transition ${
                          isInWishlist(id)
                            ? "text-red-500"
                            : "text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-600"
                        }`}
                      >
                        <Heart
                          size={14}
                          className={isInWishlist(id) ? "fill-red-500 text-red-500" : ""}
                        />
                        {isInWishlist(id) ? t("cart.inWishlist") : t("cart.moveToWishlist")}
                      </button>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sticky top-24 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-5">{t("cart.orderSummary")}</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-slate-400">
                <span>{t("cart.subtotal")}</span>
                <span className="text-gray-900 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>{t("cart.discount")}</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-slate-800 my-4 pt-4 flex justify-between font-bold text-gray-900 dark:text-slate-100">
              <span>{t("cart.total")}</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>

            {/* Coupon */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-500/10 text-green-600 dark:text-green-400 text-sm px-3 py-2.5 rounded-lg mb-4 border border-green-500/20">
                <span className="flex items-center gap-2">
                  <Tag size={14} />
                  {t("cart.couponApplied", { code: appliedCoupon.code || appliedCoupon })}
                </span>
                <button onClick={handleRemoveCoupon} disabled={couponLoading} className="cursor-pointer">
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
                  className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2.5 bg-gray-900 dark:bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-blue-400 transition disabled:opacity-50 cursor-pointer"
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
              className="w-full flex items-center justify-center text-sm text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-600 mt-3 transition"
            >
              {t("cart.continueShopping")}
            </Link>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="text-[11px] text-gray-500 dark:text-slate-400">
                  {t("cart.securePayment")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="text-[11px] text-gray-500 dark:text-slate-400">{t("cart.easyReturns")}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Headphones className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="text-[11px] text-gray-500 dark:text-slate-400">{t("cart.support")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}