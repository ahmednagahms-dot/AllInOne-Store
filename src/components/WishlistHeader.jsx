import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function WishlistHeader({ itemsCount, onMoveAllToCart, onClearWishlist }) {
  return (
    <div className="mb-6">
      <nav className="flex text-xs font-medium text-slate-400 mb-2">
        <a href="#home" className="hover:text-slate-600 transition-colors">Home</a>
        <span className="mx-2">/</span>
        <span className="text-slate-600">My Wishlist</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              My Wishlist
            </h1>
            <span className="bg-blue-50 text-blue-600 font-semibold text-xs px-2.5 py-1 rounded-full border border-blue-200">
              {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Items you've saved for later. Move them to cart or manage your list.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={onMoveAllToCart}
            disabled={itemsCount === 0}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Move All to Cart</span>
          </button>
          <button
            onClick={onClearWishlist}
            disabled={itemsCount === 0}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Clear Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}