import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Star, ImageOff } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { toast } from "react-toastify";

function resolveFirstImage(product) {
  if (!product) return null;

  const candidates = [
    Array.isArray(product.images) ? product.images[0] : null,
    product.image,
    product.thumbnail,
    product.coverImage,
    product.productImage,
    product.img,
    Array.isArray(product.photos) ? product.photos[0] : null,
  ];

  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string" && c.trim()) return c.trim();
    if (typeof c === "object") {
      const url = c.url || c.path || c.src;
      if (url) return url;
    }
  }

  return null;
}

function formatPrice(value, currency = "$") {
  if (value === null || value === undefined || value === "") return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return `${currency}${value}`;
  return `${currency}${num.toFixed(2)}`;
}

function getPricing(product) {
  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;
  const oldPrice =
    Number(product.oldPrice || product.comparePrice) ||
    (discountPrice > 0 && discountPrice < price ? price : 0);

  let discount = Number(product.discount) || 0;
  let finalPrice = price;
  let finalOldPrice = oldPrice;

  if (discountPrice > 0 && discountPrice < price) {
    finalPrice = discountPrice;
    finalOldPrice = price;
    discount = Math.round(((price - discountPrice) / price) * 100);
  } else if (!finalOldPrice && discount > 0 && price > 0) {
    finalOldPrice = price / (1 - discount / 100);
  } else if (!discount && finalOldPrice && price) {
    discount = Math.round(((finalOldPrice - price) / finalOldPrice) * 100);
  }

  return { price: finalPrice, oldPrice: finalOldPrice, discount };
}

export default function ProductCard({ product }) {
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
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Please log in first"
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
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Please log in first"
      );
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      {/* Image */}
      <div className="relative flex h-[220px] items-center justify-center overflow-hidden bg-slate-50 p-4">
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
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-300">
              <ImageOff size={32} />
              <span className="text-xs text-slate-400">No Image</span>
            </div>
          )}
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white text-slate-500 hover:bg-[#5046E5] hover:text-white"
          }`}
        >
          <Heart size={17} className={liked ? "fill-current" : ""} />
        </button>

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Out of stock */}
        {stock === 0 && (
          <span className="absolute bottom-3 left-3 rounded-full bg-slate-800/90 px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of Stock
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
                    : "fill-slate-200 text-slate-200"
                }
              />
            ))}
          </div>
          {reviewsCount > 0 ? (
            <span className="text-xs font-medium text-slate-500">
              ({reviewsCount})
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400">
              {rating || "New"}
            </span>
          )}
        </div>

        {/* Name */}
        <Link to={productId ? `/products/${productId}` : "#"}>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-[#0F172A] hover:text-[#5046E5] transition">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-[#5046E5]">
            {formatPrice(price)}
          </span>
          {oldPrice > 0 && oldPrice > price && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock === 0 || cartLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5046E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ShoppingCart size={17} />
          {stock === 0
            ? "Out of Stock"
            : cartLoading
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}