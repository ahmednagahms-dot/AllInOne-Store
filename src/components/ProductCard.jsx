import React from 'react';
import { Heart, Star, ShoppingCart, Trash2 } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onRemoveItem }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        <div className="relative aspect-square bg-slate-100 p-6 flex items-center justify-center overflow-hidden">
          <span className="absolute top-3 left-3 bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-md border border-red-100 z-10">
            {product.discount}
          </span>

          <button
            onClick={() => onRemoveItem(product.id, product.title)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-red-500 hover:bg-white hover:scale-110 transition-all z-10"
            title="Remove from wishlist"
          >
            <Heart className="w-4 h-4 fill-red-500" />
          </button>

          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block mb-1">
            {product.category}
          </span>

          <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">
              {product.rating}
            </span>
            <span className="text-xs text-slate-400">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-black text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-400 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-semibold text-emerald-600">
              In Stock
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 flex items-center gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
        <button
          onClick={() => onRemoveItem(product.id, product.title)}
          className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
          title="Delete item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}