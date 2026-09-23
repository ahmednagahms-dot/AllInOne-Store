import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  availability, 
  setAvailability,
  selectedDiscount, 
  setSelectedDiscount
}) {
  const { t } = useTranslation();
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
    { labelKey: "shop.sidebar.discount50", fallback: "50% or more", value: 50 },
    { labelKey: "shop.sidebar.discount30", fallback: "30% or more", value: 30 },
    { labelKey: "shop.sidebar.discount20", fallback: "20% or more", value: 20 },
    { labelKey: "shop.sidebar.discount10", fallback: "10% or more", value: 10 },
  ].map(tier => ({
    ...tier,
    label: t(tier.labelKey, { defaultValue: tier.fallback }),
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

  const allCategories = [...new Set(products.map(p => {
    const cat = typeof p.category === 'object' ? p.category?.name : p.category;
    return cat ? cat.toLowerCase() : null;
  }).filter(Boolean))];

  let dynamicCategoryMap = allCategories.map(catName => {
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

  const uncategorizedCount = products.filter(p => {
    const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
    return !pCat; 
  }).length;

  if (uncategorizedCount > 0) {
    dynamicCategoryMap.push({
      name: 'others',
      icon: Package, 
      count: uncategorizedCount
    });
  }

  const relevantProducts = selectedCategories.length > 0 
    ? products.filter(p => {
        const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
        return selectedCategories.includes(pCat?.toLowerCase());
      })
    : products;

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
      <h3 className="font-bold text-gray-900 dark:text-slate-100 text-[15px]">{title}</h3>
      {openSections[section] ? (
        <ChevronUp size={18} className="text-gray-500 dark:text-slate-400" />
      ) : (
        <ChevronDown size={18} className="text-gray-500 dark:text-slate-400" />
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-6 sticky top-4 shadow-sm w-full lg:w-72 max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar transition-colors duration-200">
      
      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-6">
        <SectionHeader title={t("shop.sidebar.categories")} section="categories" />
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
                      className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-blue-600 dark:checked:bg-indigo-600 checked:border-blue-600 dark:checked:border-indigo-600 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <cat.icon size={16} className="text-gray-400 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition" />
                  <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition capitalize">
                    {cat.name === "others" 
                      ? t("shop.sidebar.others", "others") 
                      : t(`categories.items.${cat.name.toLowerCase()}`, { defaultValue: cat.name })}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500">({cat.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-6">
        <SectionHeader title={t("shop.sidebar.subcategories")} section="subcategories" />
        {openSections.subcategories && (
          <div>
            <div className="space-y-3.5 mb-3">
              {(showAllSubcats ? dynamicSubcategories : dynamicSubcategories.slice(0, 5)).map(sub => (
                <label key={sub.name} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={selectedSubcategories.includes(sub.name.toLowerCase())}
                        onChange={() => {
                          const lowerSub = sub.name.toLowerCase();
                          setSelectedSubcategories(prev => 
                            prev.includes(lowerSub) ? prev.filter(c => c !== lowerSub) : [...prev, lowerSub]
                          );
                        }}
                        className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-blue-600 dark:checked:bg-indigo-600 checked:border-blue-600 dark:checked:border-indigo-600 transition-all cursor-pointer" 
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition capitalize">
                      {t(`categories.items.${sub.name.toLowerCase()}`, { defaultValue: sub.name })}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500">({sub.count})</span>
                </label>
              ))}
            </div>
            {dynamicSubcategories.length > 5 && (
              <button onClick={() => setShowAllSubcats(!showAllSubcats)} className="text-sm text-blue-600  font-medium hover:underline flex items-center gap-1 cursor-pointer">
                {showAllSubcats ? t("shop.sidebar.showLess") : t("shop.sidebar.showMore")} <ChevronDown size={14} className={showAllSubcats ? "rotate-180" : ""} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-6">
        <SectionHeader title={t("shop.sidebar.price")} section="price" />
        {openSections.price && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  className="w-full ps-7 pe-3 py-2 text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  className="w-full ps-7 pe-3 py-2 text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="relative w-full h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full mb-2 mt-4" dir="ltr">
              <div
                className="absolute h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow transition-all duration-300"
                style={{
                  left: `${leftPercent}%`,
                }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow transition-all duration-300"
                style={{
                  right: `${rightPercent}%`,
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
            <div className="text-xs text-gray-400 dark:text-slate-500 mt-2">$0 - $5,000</div>
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-6">
        <SectionHeader title={t("shop.sidebar.rating")} section="rating" />
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
                    className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-600 dark:checked:border-blue-600 transition-all cursor-pointer"
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
                  <span className="text-sm text-gray-600 dark:text-slate-300">
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
                            : "fill-gray-200 dark:fill-slate-700 text-gray-200 dark:text-slate-700"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-slate-400">{t("shop.sidebar.andUp")}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-100 dark:border-slate-800 pb-6">
        <SectionHeader title={t("shop.sidebar.availability")} section="availability" />
        {openSections.availability && (
          <div className="space-y-3.5">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('in-stock')} onChange={() => handleAvailabilityChange('in-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-600 dark:checked:border-blue-600 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition">{t("shop.sidebar.inStock")}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500">({inStockCount})</span>
            </label>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('low-stock')} onChange={() => handleAvailabilityChange('low-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition">{t("shop.sidebar.lowStock")}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500">({lowStockCount})</span>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" checked={availability.includes('out-of-stock')} onChange={() => handleAvailabilityChange('out-of-stock')} className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-red-500 checked:border-red-500 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition">{t("shop.sidebar.outOfStock")}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500">({outOfStockCount})</span>
            </label>
          </div>
        )}
      </div>

      <div className="mb-6">
        <SectionHeader title={t("shop.sidebar.discount")} section="discount" />
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
                      className="peer appearance-none w-4 h-4 border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 checked:bg-blue-600 dark:checked:bg-indigo-600 checked:border-blue-600 dark:checked:border-indigo-600 transition-all cursor-pointer" 
                    />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition">{tier.label}</span>
                </div>
                <span className="text-xs text-gray-400 dark:text-slate-500">({tier.count})</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-medium rounded-xl hover:border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition shadow-sm text-sm cursor-pointer"
      >
        {t("shop.sidebar.clearFilters")}
      </button>
    </div>
  );
}