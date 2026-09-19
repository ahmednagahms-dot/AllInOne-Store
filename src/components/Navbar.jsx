import React from 'react';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

export default function Navbar({ cartCount }) {
  return (
    <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span>StoreFront</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 text-slate-700 px-3.5 py-2 rounded-lg font-medium text-sm transition-colors">
            <ShoppingCart className="w-4 h-4 text-blue-600" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}