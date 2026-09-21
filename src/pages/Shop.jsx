import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import ProductCard from "../components/products/ProductCard";
import Pagination from "../components/ui/Pagination";
import ProductToolbar from "../components/products/ProductToolbar";
import ShopSidebar from "../components/products/ShopSidebar";
import ShopFeatures from "../components/products/ShopFeatures";
import { Search, ChevronRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const ShopImage =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1789752545/swhfkjpwjhblaonheeo5.png";

export default function Shop() {
  const { t } = useTranslation();
  const location = useLocation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [availability, setAvailability] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam.toLowerCase()]);
    }

    const subcategoryParam = params.get("subcategory");
    if (subcategoryParam) {
      setSelectedSubcategories([subcategoryParam.toLowerCase()]);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products?limit=1000`);
        let fetchedProducts = [];
        if (Array.isArray(response.data)) fetchedProducts = response.data;
        else if (Array.isArray(response.data?.products))
          fetchedProducts = response.data.products;
        else if (Array.isArray(response.data?.data))
          fetchedProducts = response.data.data;

        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => {
        const sub =
          typeof p.subcategory === "object"
            ? p.subcategory.name
            : p.subcategory;
        if (!sub) {
          return selectedSubcategories.includes("others");
        }
        return selectedSubcategories.includes(sub.toLowerCase());
      });
    }

    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const cat =
          typeof p.category === "object" ? p.category.name : p.category;
        return selectedCategories.includes(cat?.toLowerCase());
      });
    }

    const getActualPrice = (p) => {
      const price = Number(p.price) || 0;
      const discountPrice = Number(p.discountPrice) || 0;
      return discountPrice > 0 && discountPrice < price ? discountPrice : price;
    };

    if (priceRange.min !== "")
      result = result.filter(
        (p) => getActualPrice(p) >= Number(priceRange.min)
      );
    if (priceRange.max !== "")
      result = result.filter(
        (p) => getActualPrice(p) <= Number(priceRange.max)
      );

    if (selectedRating > 0) {
      result = result.filter((p) => (Number(p.averageRating) || 0) >= selectedRating);
    }

    if (availability.length > 0) {
      result = result.filter((p) => {
        const st = Number(p.stock) || 0;
        if (availability.includes('in-stock') && st > 5) return true;
        if (availability.includes('low-stock') && st > 0 && st <= 5) return true;
        if (availability.includes('out-of-stock') && st <= 0) return true;
        return false;
      });
    }

    if (selectedDiscount > 0) {
      result = result.filter((p) => {
        const price = Number(p.price) || 0;
        const discountPrice = Number(p.discountPrice) || 0;
        if (!discountPrice || discountPrice >= price) return false;
        const pct = Math.round(((price - discountPrice) / price) * 100);
        return pct >= selectedDiscount;
      });
    }

    if (sortOption === "price-asc") {
      result.sort((a, b) => getActualPrice(a) - getActualPrice(b));
    } else if (sortOption === "price-desc") {
      result.sort((a, b) => getActualPrice(b) - getActualPrice(a));
    } else if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [
    allProducts,
    searchQuery,
    sortOption,
    selectedCategories,
    selectedSubcategories,
    priceRange,
    selectedRating,
    availability,
    selectedDiscount,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    sortOption,
    selectedCategories,
    selectedSubcategories,
    priceRange,
    selectedRating,
    availability,
    selectedDiscount,
  ]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-12 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6 flex items-center gap-2 text-sm">
        <Link to="/" className="text-gray-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-indigo-400 transition">
          {t("nav.home")}
        </Link>
        <ChevronRight size={14} className="text-gray-300 dark:text-slate-600 rtl:rotate-180" />
        <span className="text-gray-800 dark:text-slate-200 font-medium">{t("shop.title")}</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-[#f4f7fb] dark:bg-slate-900/80 border border-1 border-blue-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 lg:p-12 mb-8 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden gap-8 lg:gap-0">
          <div className="z-10 w-full lg:w-1/2 text-center lg:text-left rtl:lg:text-right">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#111827] dark:text-white mb-3 lg:mb-4 tracking-tight">
              {t("shop.title")}
            </h1>
            <p className="text-gray-500 dark:text-slate-400 text-base lg:text-lg mb-1 max-w-xl mx-auto lg:mx-0">
              {t("shop.subtitle")}
            </p>
            <p className="text-gray-500 dark:text-slate-400 text-base lg:text-lg">
              {t("shop.productsFound", { count: filteredProducts.length })}
            </p>
          </div>

          <div className="z-10 w-full lg:w-1/2 flex items-center justify-center lg:justify-end gap-6 sm:gap-4 lg:ms-52">
            <div
              className="flex flex-col transform -rotate-12 text-[#424750] dark:text-indigo-200/60 opacity-90 text-3xl sm:text-4xl lg:text-[2.5rem]"
              style={{ fontFamily: "'Caveat', cursive", lineHeight: "1.1" }}
            >
              <span className="ms-2 lg:ms-4">{t("shop.floatingText.line1")}</span>
              <span className="ms-5 lg:ms-8">{t("shop.floatingText.line2")}</span>
              <span className="-ms-1 lg:-ms-2">{t("shop.floatingText.line3")}</span>
              <span className="ms-4 lg:ms-6">{t("shop.floatingText.line4")}</span>
            </div>

            <div className="relative group flex-shrink-0">
              <div className="absolute inset-0 bg-blue-200/50 dark:bg-indigo-500/20 rounded-2xl lg:rounded-3xl blur-lg lg:blur-xl transform translate-y-2 lg:translate-y-3 scale-95 group-hover:scale-100 transition-all duration-500"></div>
              <img
                src={ShopImage}
                alt="Workspace"
                className="relative z-10 w-56 sm:w-80 lg:w-96 h-36 sm:h-44 lg:h-52 object-cover rounded-[1rem] lg:rounded-[1.5rem] border-2 border-white/60 dark:border-slate-700/60 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-auto flex-shrink-0">
            <ShopSidebar
              products={allProducts}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedSubcategories={selectedSubcategories}
              setSelectedSubcategories={setSelectedSubcategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              availability={availability}
              setAvailability={setAvailability}
              selectedDiscount={selectedDiscount}
              setSelectedDiscount={setSelectedDiscount}
            />
          </aside>

          <main className="w-full flex-1">
            <ProductToolbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {loading ? (
              <div className="text-center py-20 text-gray-500 dark:text-slate-400 font-semibold animate-pulse">
                {t("shop.loadingProducts")}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "list"
                      ? "flex flex-col gap-4"
                      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  }
                >
                  {displayedProducts.map((product, index) => (
                    <div
                      key={product._id || product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center h-[500px]">
                <div className="w-16 h-16 bg-blue-50 dark:bg-indigo-950/50 rounded-full flex items-center justify-center text-blue-600 dark:text-indigo-400 mb-5">
                  <Search size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                  {t("shop.noResultsTitle")}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm max-w-sm mx-auto mb-6">
                  {t("shop.noResultsSubtitle")}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setSelectedSubcategories([]);
                    setPriceRange({ min: 0, max: 5000 });
                    setSelectedRating(0);
                    setAvailability([]);
                    setSelectedDiscount(0);
                  }}
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-blue-600 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-700/50 transition shadow-sm cursor-pointer"
                >
                  {t("shop.browseCategories")}
                </button>
              </div>
            )}
          </main>
        </div>
        <ShopFeatures />
      </div>
    </div>
  );
}