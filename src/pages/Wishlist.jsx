import { Link } from "react-router-dom";
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
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (id) => {
    try {
      const ok = await addToCart(id, 1);
      if (ok) {
        toast.success("Added to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?"))
      return;
    try {
      await clearAllWishlist();
      toast.success("Wishlist cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear wishlist");
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
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="text-gray-500 max-w-sm">
          We couldn't load your wishlist. Please try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={fetchWishlist}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ===== Empty State =====
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center">
          <Heart className="text-indigo-600" size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 max-w-sm">
          Save products you love here so you can find them easily later.
        </p>
        <Link
          to="/"
          className="mt-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  // ===== Wishlist with items =====
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <button
          onClick={handleClear}
          className="text-sm text-red-600 hover:underline flex items-center gap-1 font-medium"
        >
          <Trash2 size={14} />
          Clear Wishlist
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
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition group"
            >
              <div className="block relative aspect-square bg-gray-50">
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
                  className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition"
                  aria-label="Remove from wishlist"
                  title="Remove from wishlist"
                >
                  <Heart size={18} className="fill-red-500 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <Link
                  to={`/product/${id}`}
                  className="font-medium text-gray-900 line-clamp-2 min-h-[48px] block hover:text-indigo-600 transition"
                >
                  {product.name || "Product"}
                </Link>

                {product.averageRating > 0 && (
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <Star
                      size={13}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs text-gray-500">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">
                    ${Number(price).toFixed(2)}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ${Number(originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(id)}
                  disabled={!inStock}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}