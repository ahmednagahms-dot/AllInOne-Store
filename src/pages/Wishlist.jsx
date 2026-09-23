import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";
import {
  Loader2,
  Heart,
  Trash2,
  AlertTriangle,
} from "lucide-react";

function getItemProduct(item) {
  return item.product && typeof item.product === "object" ? item.product : item;
}

function getItemId(item) {
  return item.productId || item.product?._id || item.product || item._id;
}

export default function Wishlist() {
  const { t } = useTranslation();
  const {
    items,
    loading,
    error,
    fetchWishlist,
    clearAllWishlist,
  } = useWishlist();

  const handleClear = async () => {
    if (!window.confirm(t("wishlist.confirmClear"))) return;
    try {
      await clearAllWishlist();
    } catch (err) {
      console.error(err);
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
          <Heart className="text-blue-600" size={32} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const product = getItemProduct(item);
          const id = getItemId(item);

          return (
            <ProductCard
              key={id}
              product={{ ...product, _id: id }}
            />
          );
        })}
      </div>
    </div>
  );
}