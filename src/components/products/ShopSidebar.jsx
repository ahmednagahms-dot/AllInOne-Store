import React, { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Star,
  Monitor,
  ShoppingBag,
  Home,
  Smile,
  Zap,
  Gamepad2,
  Book,
  Smartphone,
  Tag,
  Package,
} from "lucide-react";

export default function ShopSidebar({
  products,
  selectedCategories,
  setSelectedCategories,
  selectedSubcategories, 
  setSelectedSubcategories,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  availability, setAvailability,
  selectedDiscount, 
  setSelectedDiscount
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    subcategories: true,
    price: true,
    rating: true,
    availability: true,
    discount: true,
  });
  const toggleSection = (sec) =>
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));

  const [showAllSubcats, setShowAllSubcats] = useState(false);

  const inStockCount = products.filter(p => (p.stock || 0) > 5).length;
  const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) <= 0).length;

  const getDiscountPct = (p) => {
    if (!p.discountPrice || p.discountPrice >= p.price) return 0;
    return Math.round(((p.price - p.discountPrice) / p.price) * 100);
  };
  
  const discountTiers = [
    { label: '50% or more', value: 50 },
    { label: '30% or more', value: 30 },
    { label: '20% or more', value: 20 },
    { label: '10% or more', value: 10 },
  ].map(tier => ({
    ...tier,
    count: products.filter(p => getDiscountPct(p) >= tier.value).length
  }));

  const iconDictionary = {
    'electronics': Monitor,
    'phones': Smartphone,
    'home': Home,
    'fashion': ShoppingBag,
    'beauty & care': Smile,
    'sports': Zap,
    'toys & games': Gamepad2,
    'books': Book,
    'accessories': Smartphone,
  };

  // 2. استخراج الأقسام الأساسية أوتوماتيك من الداتا الحقيقية
  const allCategories = [...new Set(products.map(p => {
    const cat = typeof p.category === 'object' ? p.category?.name : p.category;
    return cat ? cat.toLowerCase() : null;
  }).filter(Boolean))];

  // 3. بناء مصفوفة الأقسام (الاسم، الأيقونة، العدد)
  let dynamicCategoryMap = allCategories.map(catName => {
    // لو القسم ليه أيقونة في القاموس هياخدها، لو ملوش (قسم جديد) هياخد شكل التاج 🏷️
    const IconComponent = iconDictionary[catName] || Tag; 
    
    return {
      name: catName,
      icon: IconComponent,
      count: products.filter(p => {
        const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
        return pCat?.toLowerCase() === catName;
      }).length
    };
  });

  // 4. حارس الأقسام (Others) للمنتجات اللي هتيجي بدون قسم
  const uncategorizedCount = products.filter(p => {
    const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
    return !pCat; // لو مفيش category خالص
  }).length;

  if (uncategorizedCount > 0) {
    dynamicCategoryMap.push({
      name: 'others',
      icon: Package, // أيقونة صندوق للمنتجات غير المصنفة
      count: uncategorizedCount
    });
  }


  // 1. فلترة المنتجات عشان نعرض Subcategories القسم المتحدد بس!
  const relevantProducts = selectedCategories.length > 0 
    ? products.filter(p => {
        const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
        return selectedCategories.includes(pCat?.toLowerCase());
      })
    : products;

  // 2. استخراج الـ Subcategories من المنتجات المتعلقة بالقسم ده بس
  const allSubcategories = [...new Set(relevantProducts.map(p => typeof p.subcategory === 'object' ? p.subcategory?.name : p.subcategory).filter(Boolean))];

  let dynamicSubcategories = allSubcategories.map(subName => ({
    name: subName,
    count: relevantProducts.filter(p => {
      const pSub = typeof p.subcategory === 'object' ? p.subcategory?.name : p.subcategory;
      return pSub?.toLowerCase() === subName.toLowerCase();
    }).length
  }));

  const othersCount = relevantProducts.filter(p => {
    const pSub = typeof p.subcategory === 'object' ? p.subcategory?.name : p.subcategory;
    return !pSub;
  }).length;

  if (othersCount > 0) {
    dynamicSubcategories.push({
      name: 'Others',
      count: othersCount
    });
  }

  const minPrice = Number(priceRange.min) || 0;
  const maxPrice = Number(priceRange.max) || 5000;
  const maxLimit = 5000;
  const leftPercent = (minPrice / maxLimit) * 100;
  const rightPercent = 100 - (maxPrice / maxLimit) * 100;

  const handleCategoryChange = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };
  const handleAvailabilityChange = (status) => {
    setAvailability((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange({ min: 0, max: 5000 });
    setSelectedRating(0);
    setAvailability([]);
    setSelectedDiscount(0);
  };

  const SectionHeader = ({ title, section }) => (
    <div
      className="flex items-center justify-between cursor-pointer mb-4"
      onClick={() => toggleSection(section)}
    >
      <h3 className="font-bold text-gray-900 text-[15px]">{title}</h3>
      {openSections[section] ? (
        <ChevronUp size={18} className="text-gray-500" />
      ) : (
        <ChevronDown size={18} className="text-gray-500" />
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-4 shadow-sm w-full lg:w-72 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
      <div className="mb-6 border-b border-gray-100 pb-6">
        <SectionHeader title="Categories" section="categories" />
        {openSections.categories && (
          <div className="space-y-3.5">
            {dynamicCategoryMap.map(cat => (
              <label key={cat.name} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => handleCategoryChange(cat.name)}
                      className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <cat.icon size={16} className="text-gray-400 group-hover:text-blue-600 transition" />
                  {/* ضفنا capitalize هنا */}
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition capitalize">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Subcategories */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <SectionHeader title="Subcategories" section="subcategories" />
        {openSections.subcategories && (
          <div>
            <div className="space-y-3.5 mb-3">
              {(showAllSubcats ? dynamicSubcategories : dynamicSubcategories.slice(0, 5)).map(sub => (
                <label key={sub.name} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedSubcategories?.includes(sub.name.toLowerCase())}
                        onChange={() => {
                          const lowerSub = sub.name.toLowerCase();
                          setSelectedSubcategories(prev => 
                            prev.includes(lowerSub) ? prev.filter(c => c !== lowerSub) : [...prev, lowerSub]
                          );
                        }}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition capitalize">{sub.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">({sub.count})</span>
                </label>
              ))}
            </div>
            <button onClick={() => setShowAllSubcats(!showAllSubcats)} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              {showAllSubcats ? 'Show less' : 'Show more'} <ChevronDown size={14} className={showAllSubcats ? "rotate-180" : ""} />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 pb-6">
        <SectionHeader title="Price" section="price" />
        {openSections.price && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="relative w-full h-1.5 bg-gray-200 rounded-full mb-2 mt-4">
              <div
                className="absolute h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow transition-all duration-300"
                style={{
                  left: `${leftPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow transition-all duration-300"
                style={{
                  right: `${rightPercent}%`,
                  transform: "translate(50%, -50%)",
                }}
              ></div>

              <input
                type="range"
                min="0"
                max={maxLimit}
                value={minPrice}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    min: Math.min(Number(e.target.value), maxPrice - 1),
                  }))
                }
                className="absolute w-full -top-1.5 h-4 opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
                style={{ zIndex: minPrice > maxLimit - 100 ? 5 : 3 }}
              />
              <input
                type="range"
                min="0"
                max={maxLimit}
                value={maxPrice}
                onChange={(e) =>
                  setPriceRange((prev) => ({
                    ...prev,
                    max: Math.max(Number(e.target.value), minPrice + 1),
                  }))
                }
                className="absolute w-full -top-1.5 h-4 opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
                style={{ zIndex: 4 }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">$0 - $5,000</div>
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 pb-6">
        <SectionHeader title="Rating" section="rating" />
        {openSections.rating && (
          <div className="space-y-3.5">
            {[5, 4, 3].map((stars) => (
              <label
                key={stars}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedRating === stars}
                    onChange={() =>
                      setSelectedRating(selectedRating === stars ? 0 : stars)
                    }
                    className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">
                    {stars}
                    {stars < 5 ? "+" : ""}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">& up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 5. Availability */}
      <div className="mb-6 border-b border-gray-100 pb-6">
        <SectionHeader title="Availability" section="availability" />
        {openSections.availability && (
          <div className="space-y-3.5">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('in-stock')} onChange={() => handleAvailabilityChange('in-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">In Stock</span>
              </div>
              <span className="text-xs text-gray-400">({inStockCount})</span>
            </label>
            
            {/* 👇 قسم الـ Low Stock الجديد */}
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('low-stock')} onChange={() => handleAvailabilityChange('low-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">Low Stock</span>
              </div>
              <span className="text-xs text-gray-400">({lowStockCount})</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('out-of-stock')} onChange={() => handleAvailabilityChange('out-of-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-red-500 checked:border-red-500 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">Out of Stock</span>
              </div>
              <span className="text-xs text-gray-400">({outOfStockCount})</span>
            </label>
          </div>
        )}
      </div>

      {/* 6. Discount (النسخة الاحترافية) */}
      <div className="mb-6">
        <SectionHeader title="Discount" section="discount" />
        {openSections.discount && (
          <div className="space-y-3.5">
            {discountTiers.map(tier => (
              <label key={tier.value} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={selectedDiscount === tier.value} 
                      onChange={() => setSelectedDiscount(selectedDiscount === tier.value ? 0 : tier.value)} 
                      className="peer appearance-none w-4 h-4 border border-gray-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">{tier.label}</span>
                </div>
                <span className="text-xs text-gray-400">({tier.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition shadow-sm text-sm"
      >
        Clear Filters
      </button>
    </div>
  );
}
