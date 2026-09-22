import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import {
  Loader2,
  Heart,
  Trash2,
  ShoppingCart,
  AlertTriangle,
  Star,
} from "lucide-react";

function getItemProduct(item) {
  return item.product && typeof item.product === "object" ? item.product : item;
}

function getItemId(item) {
  return item.productId || item.product?._id || item.product || item._id;
}

function getItemImage(item) {
  const product = getItemProduct(item);
  const img = product.images?.[0];
  if (!img) return product.image || "/Background+Border.svg";
  if (typeof img === "string") return img;
  return img.url || product.image || "/Background+Border.svg";
}

export default function Wishlist() {
  const { t } = useTranslation();
  const {
    items,
    loading,
    error,
    fetchWishlist,
    removeItem,
    clearAllWishlist,
  } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleRemove = async (id) => {
    try {
      await removeItem(id);
      toast.success(t("wishlist.removedSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("wishlist.removeError"));
    }
  };

  const handleAddToCart = async (id) => {
    try {
      const ok = await addToCart(id, 1);
      if (ok) {
        toast.success(t("wishlist.addedToCartSuccess"));
      }
    } catch (err) {
      console.error(err);
      toast.error(t("wishlist.addToCartError"));
    }
  };

  const handleClear = async () => {
    if (!window.confirm(t("wishlist.confirmClear")))
      return;
    try {
      await clearAllWishlist();
      toast.success(t("wishlist.clearedSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(t("wishlist.clearError"));
    }
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // ===== Error State =====
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          {t("wishlist.errorTitle")}
        </h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          {t("wishlist.errorSubtitle")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={fetchWishlist}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-400 transition cursor-pointer"
          >
            {t("wishlist.tryAgain")}
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition"
          >
            {t("wishlist.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-blue-600/10 flex items-center justify-center">
          <Heart className="text-blue-600 " size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          {t("wishlist.emptyTitle")}
        </h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-sm">
          {t("wishlist.emptySubtitle")}
        </p>
        <Link
          to="/"
          className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          {t("wishlist.exploreProducts")}
        </Link>
      </div>
    );
  }

  // ===== Wishlist with items =====
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-100">
            {t("wishlist.title")}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            {t("wishlist.itemCount", { count: items.length })}
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-red-500 dark:text-red-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <Trash2 size={14} />
          {t("wishlist.clear")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const product = getItemProduct(item);
          const id = getItemId(item);
          const price = product.discountPrice ?? product.price ?? 0;
          const originalPrice = product.discountPrice ? product.price : null;
          const inStock = product.stock === undefined || product.stock > 0;

          return (
            <div
              key={id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-md dark:hover:shadow-indigo-950/30 transition group shadow-sm"
            >
              <div className="block relative aspect-square bg-gray-50 dark:bg-slate-800/60">
                <Link to={`/product/${id}`}>
                  <img
                    src={getItemImage(item)}
                    alt={product.name || "Product"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "/Background+Border.svg";
                    }}
                  />
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(id);
                  }}
                  className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-9 h-9 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 dark:hover:bg-slate-700 transition cursor-pointer"
                  aria-label={t("wishlist.removeFromWishlist")}
                  title={t("wishlist.removeFromWishlist")}
                >
                  <Heart size={18} className="fill-red-500 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <Link
                  to={`/product/${id}`}
                  className="font-medium text-gray-900 dark:text-slate-100 line-clamp-2 min-h-[48px] block hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {product.name || "Product"}
                </Link>

                {product.averageRating > 0 && (
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <Star
                      size={13}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900 dark:text-blue-400">
                    ${Number(price).toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-gray-400 dark:text-slate-500 line-through">
                      ${Number(originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(id)}
                  disabled={!inStock}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:bg-gray-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  {inStock ? t("wishlist.addToCart") : t("wishlist.outOfStock")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}