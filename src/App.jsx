import React, { useState, useMemo } from 'react';
import { INITIAL_WISHLIST } from './data/wishlistData';
import Navbar from './components/Navbar';
import WishlistHeader from './components/WishlistHeader';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import EmptyState from './components/EmptyState';
import FeaturesFooter from './components/FeaturesFooter';

import Toast from './components/Toast';

export default function App() {
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recently');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const removeItem = (id, title) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
    showToast(`Removed "${title}" from your wishlist.`, 'info');
  };

  const clearWishlist = () => {
    if (wishlist.length === 0) return;
    setWishlist([]);
    showToast('Your wishlist has been cleared.', 'info');
  };

  const addToCart = (item) => {
    setCartCount(prev => prev + 1);
    showToast(`Added "${item.title}" to cart!`);
  };

  const moveAllToCart = () => {
    if (wishlist.length === 0) return;
    setCartCount(prev => prev + wishlist.length);
    showToast(`Moved all ${wishlist.length} items to your cart!`);
    setWishlist([]);
  };

  const filteredWishlist = useMemo(() => {
    return wishlist
      .filter(item => {
        const query = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) || 
               item.category.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
  }, [wishlist, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-12 antialiased">
      <Toast toastMessage={toastMessage} />
      <Navbar cartCount={cartCount} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <WishlistHeader 
          itemsCount={wishlist.length} 
          onMoveAllToCart={moveAllToCart} 
          onClearWishlist={clearWishlist} 
        />

        <FilterBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          sortBy={sortBy} 
          setSortBy={setSortBy} 
        />

        {filteredWishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {filteredWishlist.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                onRemoveItem={removeItem} 
              />
            ))}
          </div>
        ) : (
          <EmptyState 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onReset={() => setWishlist(INITIAL_WISHLIST)} 
          />
        )}

        <FeaturesFooter />
      </main>
    </div>
  );
}