
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";

export default function ProductCard({ product, viewMode = "grid" }) {
  const navigate = useNavigate();

import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Heart, ShoppingCart, Star, ImageOff } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";

function resolveFirstImage(product) {

  if (!product) return null;

  const isList = viewMode === "list";
  const productId = product._id || product.id;

  const title = product.name || "Product Name";
  const category =
    typeof product.category === "object"
      ? product.category.name
      : product.category || "Uncategorized";

  const firstImage = product.images && product.images[0];
  const image =
    firstImage?.secure_url ||
    firstImage?.url ||
    (typeof firstImage === "string"
      ? firstImage
      : "https://placehold.co/500x500?text=No+Image");

  const price = product.price || 0;
  const discountPrice = product.discountPrice || 0;
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
    stockStatus = "In stock";
    stockDotColor = "bg-green-500";
    stockTextColor = "text-green-600";
  } else if (stock > 0 && stock <= 10) {
    stockStatus = "Low stock";
    stockDotColor = "bg-orange-400";
    stockTextColor = "text-orange-500";
  } else {
    stockStatus = "Out of stock";
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
    badge = "New";
    badgeColor = "bg-green-500";
  } else if (isExplicitSale) {
    badge = "Sale";
    badgeColor = "bg-blue-600";
  }

  return (
    <div
      onClick={() => navigate(`/product/${productId}`, { state: { product } })}
      className={`bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group flex cursor-pointer ${isList ? "flex-col sm:flex-row gap-6 items-center" : "flex-col h-full"}`}
    >
      <div
        className={`relative bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${isList ? "w-full sm:w-56 h-56" : "aspect-square mb-4"}`}
      >
        {badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white rounded-full z-10 ${badgeColor}`}
          >
            {badge}
          </span>
        )}
        <button 
          onClick={(e) => e.stopPropagation()} // 👈 عشان لو داس على القلب الكارت مايفتحش
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm transition z-10"
=======
  return { price: finalPrice, oldPrice: finalOldPrice, discount };
}

export default function ProductCard({ product }) {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const { addItem: addToCart } = useCart();
  const {
    isInWishlist,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const productId = product._id || product.id;
  const name = product.name || product.title || "Unnamed Product";
  const rating = Number(product.rating || product.averageRating) || 0;
  const reviewsCount =
    product.reviewsCount ?? product.numReviews ?? product.reviews?.length ?? 0;
  const stock = product.stock ?? 1;

  const imageUrl = resolveFirstImage(product);
  const showImage = imageUrl && !imageError;
  const { price, oldPrice, discount } = getPricing(product);

  const liked = isInWishlist?.(productId) ?? false;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;

    try {
      if (liked) {
        await removeFromWishlist(productId);
        toast.success(t("productCard.removedFromWishlist"));
      } else {
        await addToWishlist(productId);
        toast.success(t("productCard.addedToWishlist"));
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || t("productCard.loginRequired")
      );
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!productId || stock === 0) return;

    try {
      setCartLoading(true);
      await addToCart(productId, 1);
      toast.success(t("productCard.addedToCart"));
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || t("productCard.loginRequired")
      );
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-xl dark:hover:shadow-indigo-950/20">
      {/* Image */}
      <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50 p-4">
        <Link
          to={productId ? `/products/${productId}` : "#"}
          className="h-full w-full"
        >
          {showImage ? (
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              onError={() => setImageError(true)}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300 dark:text-slate-600">
              <ImageOff size={32} />
              <span className="text-xs text-slate-400 dark:text-slate-500">{t("productCard.noImage")}</span>
            </div>
          )}
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className={`absolute right-3 rtl:right-auto rtl:left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition cursor-pointer ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-[#5046E5] dark:hover:bg-[#5046E5] hover:text-white"
          }`}

        >
          <Heart size={16} />
        </button>
        <img
          src={image}
          alt={title}
          className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500 w-full h-full"
        />
      </div>


      <div
        className={`flex-grow flex flex-col ${isList ? "w-full py-2 justify-center" : ""}`}
      >
        <span className="text-xs text-gray-400 mb-1 capitalize">
          {category}
        </span>
        <h3
          className="font-semibold text-gray-900 mb-1 line-clamp-1"
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">
            ({reviewsCount} reviews)

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 rtl:left-auto rtl:right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm dir-ltr">
            -{discount}%

          </span>
        </div>


        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          {discountString && (
            <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
              {discountString}

        {/* Out of stock */}
        {stock === 0 && (
          <span className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 rounded-full bg-slate-800/90 dark:bg-slate-900/90 px-2.5 py-1 text-[11px] font-semibold text-white border border-slate-700/50">
            {t("productCard.outOfStock")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={13}
                className={
                  i <= Math.round(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                }
              />
            ))}
          </div>
          {reviewsCount > 0 ? (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ({reviewsCount})
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {rating || t("productCard.new")}

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

        {/* Name */}
        <Link to={productId ? `/products/${productId}` : "#"}>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-[#0F172A] dark:text-slate-100 hover:text-[#5046E5] dark:hover:text-indigo-400 transition text-start">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-[#5046E5] dark:text-indigo-400">
            {formatPrice(price)}
          </span>
          {oldPrice > 0 && oldPrice > price && (
            <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
              {formatPrice(oldPrice)}
            </span>
          )}

        </div>
      </div>

      <div
        className={`flex gap-2 flex-shrink-0 ${isList ? "w-full sm:w-auto sm:min-w-[160px]" : ""}`}
      >
        <button

          onClick={(e) => e.stopPropagation()}
          disabled={stock <= 0}
          className={`group flex-grow flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 shadow-sm whitespace-nowrap
            ${
              stock <= 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
            }`}
        >
          <ShoppingCart
            size={18}
            className={`${stock > 0 ? "transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" : ""}`}
          />
          <span>{stock <= 0 ? "Out of Stock" : "Add to Cart"}</span>

          type="button"
          onClick={handleAddToCart}
          disabled={stock === 0 || cartLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5046E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 cursor-pointer shadow-sm"
        >
          <ShoppingCart size={17} />
          {stock === 0
            ? t("productCard.outOfStock")
            : cartLoading
            ? t("productCard.adding")
            : t("productCard.addToCart")}

        </button>

        <div
          className="w-11 h-11 flex-shrink-0 border border-gray-200 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all z-20"
          title="View Details"
        >
          <Eye size={18} />
        </div>
      </div>
    </div>
  );
}