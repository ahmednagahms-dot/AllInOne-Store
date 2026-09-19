import React from 'react';
import { Search, Grid, List, Filter } from 'lucide-react';

export default function ProductToolbar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  onFilterToggle
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="py-2 px-3 pr-8 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 text-sm font-medium bg-white cursor-pointer shadow-sm appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-200 shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} />
          </button>
        </div>

        <button
          onClick={onFilterToggle}
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition shadow-sm lg:hidden"
        >
          <Filter size={16} />
          Filter
        </button>
      </div>

    </div>
  );
}