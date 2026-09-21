import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, Star, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, viewMode = "grid" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addItem } = useCart(); 
  
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const isList = viewMode === "list";
  const productId = product._id || product.id; 

  const title = product.name || "Product Name";
  const rawCat =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;
  const category = rawCat
    ? t(`categories.items.${rawCat.toLowerCase()}`, { defaultValue: rawCat })
    : t("shop.sidebar.others", "Uncategorized");

  const firstImage = product.images && product.images[0];
  const image =
    firstImage?.secure_url ||
    firstImage?.url ||
    (typeof firstImage === "string"
      ? firstImage
      : "https://placehold.co/500x500?text=No+Image");

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const hasDiscount = discountPrice > 0 && discountPrice < price;

  const currentPrice = hasDiscount ? discountPrice : price;
  const originalPrice = hasDiscount ? price : null;
  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;
  const discountString = hasDiscount ? `-${discountPercent}%` : null;

  const stock = product.stock || 0;
  let stockStatus = "";
  let stockDotColor = "";
  let stockTextColor = "";

  if (stock > 10) {
    stockStatus = t("shop.sidebar.inStock", "In stock");
    stockDotColor = "bg-green-500";
    stockTextColor = "text-green-600";
  } else if (stock > 0 && stock <= 10) {
    stockStatus = t("shop.sidebar.lowStock", "Low stock");
    stockDotColor = "bg-orange-400";
    stockTextColor = "text-orange-500";
  } else {
    stockStatus = t("productCard.outOfStock", "Out of stock");
    stockDotColor = "bg-red-500";
    stockTextColor = "text-red-500";
  }

  const rating = product.averageRating || 0;
  const reviewsCount = product.numReviews || 0;

  let badge = null;
  let badgeColor = "";
  const isNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isExplicitSale = product.tags?.includes("sale") || product.featured;

  if (isNew) {
    badge = t("productCard.new", "New");
    badgeColor = "bg-green-500";
  } else if (isExplicitSale) {
    badge = t("offer.badge", "Sale");
    badgeColor = "bg-blue-600";
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (stock <= 0 || isAdding) return;
    
    setIsAdding(true);
    try {
      const success = await addItem(productId, 1);
      if (success) {
        navigate('/cart');
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${productId}`, { state: { product } })}
      className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg dark:hover:shadow-indigo-950/20 transition-all duration-300 group flex cursor-pointer ${isList ? "flex-col sm:flex-row gap-6 items-center" : "flex-col h-full"}`}
    >
      <div
        className={`relative bg-gray-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${isList ? "w-full sm:w-56 h-56" : "aspect-square mb-4"}`}
      >
        {badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white rounded-full z-10 ${badgeColor}`}
          >
            {badge}
          </span>
        )}
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 shadow-sm transition z-10 cursor-pointer"
        >
          <Heart size={16} />
        </button>
        <img
          src={image}
          alt={title}
          className="object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500 w-full h-full"
        />
      </div>

      <div
        className={`flex-grow flex flex-col ${isList ? "w-full py-2 justify-center" : ""}`}
      >
        <span className="text-xs text-gray-400 dark:text-slate-500 mb-1 capitalize">
          {category}
        </span>
        <h3
          className="font-semibold text-gray-900 dark:text-slate-100 mb-1 line-clamp-1"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-slate-300">{rating}</span>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            ({reviewsCount})
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-slate-100">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 dark:text-slate-500 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountString && (
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
              {discountString}
            </span>
          )}
        </div>

        <div className={`mb-4 ${isList ? "" : "mt-auto"}`}>
          <div
            className={`flex items-center gap-1.5 text-xs font-medium ${stockTextColor}`}
          >
            <span className={`w-2 h-2 rounded-full ${stockDotColor}`}></span>
            {stockStatus}
          </div>
        </div>
      </div>

      <div
        className={`flex gap-2 flex-shrink-0 ${isList ? "w-full sm:w-auto sm:min-w-[160px]" : ""}`}
      >
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0 || isAdding}
          className={`group flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer
            ${
              stock <= 0
                ? "bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed border border-gray-200 dark:border-slate-700"
                : isAdding
                ? "bg-blue-400 dark:bg-indigo-500 cursor-wait text-white"
                : "bg-blue-600 dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
            }`}
        >
          {isAdding ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShoppingCart
              size={18}
              className={`${stock > 0 ? "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" : ""}`}
            />
          )}
          <span>
            {stock <= 0
              ? t("productCard.outOfStock")
              : isAdding
              ? t("productCard.adding")
              : t("productCard.addToCart")}
          </span>
        </button>

        <div
          onClick={() => navigate(`/product/${productId}`, { state: { product } })}
          className="w-11 h-11 flex-shrink-0 border border-gray-200 dark:border-slate-700 flex items-center justify-center rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-indigo-400 hover:border-blue-200 dark:hover:border-indigo-500/50 transition-all z-20 cursor-pointer"
          title={t("common.viewAll", "View Details")}
        >
          <Eye size={18} />
        </div>
      </div>
    </div>
  );
}