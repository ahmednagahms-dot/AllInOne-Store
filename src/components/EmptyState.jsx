import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export default function EmptyState({ searchQuery, setSearchQuery, onReset }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center mb-12 shadow-sm">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Heart className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Your wishlist is empty
      </h3>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
        {searchQuery 
          ? `No products match your search "${searchQuery}"`
          : "Explore our products and tap the heart icon to save items you love for later!"}
      </p>
      {searchQuery ? (
        <button
          onClick={() => setSearchQuery('')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          Clear Search Filter
        </button>
      ) : (
        <button
          onClick={onReset}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 mx-auto"
        >
          <span>Reset Demo Items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}