import { Heart, ShoppingCart, Star } from "lucide-react";

function ProductCard({ product }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Product Image */}
        <div className="relative flex h-[220px] items-center justify-center bg-slate-50 p-5">
            {product.image ? (
            <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
            />
            ) : (
            <div className="text-sm text-slate-400">
                No Image
            </div>
            )}

            {/* Wishlist */}
            <button
            type="button"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-[#5046E5] hover:text-white"
            aria-label="Add to wishlist"
            >
            <Heart size={17} />
            </button>

            {/* Discount */}
            {product.discount && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                -{product.discount}%
            </span>
            )}
        </div>

        {/* Product Info */}
        <div className="p-4">
            {/* Rating */}
            <div className="mb-2 flex items-center gap-1">
            <Star
                size={15}
                className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-xs font-medium text-slate-600">
                {product.rating || "4.8"}
            </span>
            </div>

            {/* Name */}
            <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-[#0F172A]">
            {product.name}
            </h3>

            {/* Price */}
            <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[#5046E5]">
                ${product.price}
            </span>

            {product.oldPrice && (
                <span className="text-sm text-slate-400 line-through">
                ${product.oldPrice}
                </span>
            )}
            </div>

            {/* Add to Cart */}
            <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5046E5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4338CA]"
            >
            <ShoppingCart size={17} />
            Add to Cart
            </button>
        </div>
        </div>
    );
}

export default ProductCard;