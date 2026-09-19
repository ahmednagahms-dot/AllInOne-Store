import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Pagination from "../components/ui/Pagination";
import DeleteConfirmModal from "../components/products/DeleteConfirmModal";
import QuickEditModal from "../components/products/QuickEditModel";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

const LIMIT = 9;

const CATEGORIES = [
  "electronics",
  "phones",
  "fashion",
  "home",
  "beauty",
  "sports",
];

export default function Products() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "";

  const [items, setItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(!!categoryParam);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditProduct, setQuickEditProduct] = useState(null);

  useEffect(() => {
    const currentCatParam = searchParams.get("category") || "";
    setCategory(currentCatParam);
    if (currentCatParam) {
      setShowFilters(true);
    }
  }, [searchParams]);

  // =========================
  // Fetch products (race-condition safe)
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/products/search", {
          params: {
            search: search || undefined,
            category: category || undefined,
            sort: sortBy || undefined,
            page: currentPage,
            limit: LIMIT,
          },
          signal: controller.signal,
        });

        setItems(res.data.products || []);
        setTotalProducts(res.data.totalProducts || 0);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }
        setError("Failed to load products.");
        toast.error("Failed to load products", {
          toastId: "products-fetch-error",
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [currentPage, category, sortBy, search, refetchTrigger]);

  const refetch = () => setRefetchTrigger((t) => t + 1);

  const handleSearch = () => {
    setSearch(searchText.trim());
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setCurrentPage(1);
    if (newCat) {
      setSearchParams({ category: newCat });
    } else {
      setSearchParams({});
    }
  };

  const changeFeatured = async (item) => {
    const newValue = !item.featured;

    setItems((prev) =>
      prev.map((x) => (x._id === item._id ? { ...x, featured: newValue } : x))
    );

    try {
      await api.patch(`/products/update/${item._id}`, { featured: newValue });
      toast.success("Featured status updated", {
        toastId: "product-featured-success",
      });
    } catch (err) {
      setItems((prev) =>
        prev.map((x) =>
          x._id === item._id ? { ...x, featured: !newValue } : x
        )
      );
      toast.error("Failed to update featured status", {
        toastId: "product-featured-error",
      });
    }
  };

  const handleDelete = (item) => {
    setSelectedProduct(item);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductDeleted = () => {
    toast.success("Product deleted successfully", {
      toastId: "product-delete-success",
    });
    if (items.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else {
      refetch();
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSearchText("");
    setCategory("");
    setSortBy("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleQuickEdit = (item) => {
    setQuickEditProduct(item);
    setQuickEditOpen(true);
  };

  const handleCloseQuickEdit = () => {
    setQuickEditOpen(false);
    setQuickEditProduct(null);
  };

  const handleProductUpdated = () => {
    refetch();
  };

  const featuredCount = items.filter((i) => i.featured).length;
  const inStockCount = items.filter((i) => i.stock > 0).length;
  const outStockCount = items.filter((i) => i.stock <= 0).length;

  const stats = [
    {
      title: t("products.totalProducts") || "Total Products",
      count: totalProducts,
      icon: Package,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: t("products.featured") || "Featured (page)",
      count: featuredCount,
      icon: Star,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: t("products.inStock") || "In Stock (page)",
      count: inStockCount,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: t("products.outOfStock") || "Out of Stock (page)",
      count: outStockCount,
      icon: Package,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <DashboardLayout>
      {loading && items.length === 0 ? (
        <PageLoader text={t("products.loading") || "Loading products..."} />
      ) : (
        <div className="p-4 sm:p-6 w-full animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("navigation.products") || "Products"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {t("products.total", { count: totalProducts }) ||
                  `${totalProducts} products total`}
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard/products/new")}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              {t("navigation.addProduct") || "Add Product"}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.count}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder={
                    t("products.searchPlaceholder") || "Search products..."
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 outline-none text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <button
                onClick={handleSearch}
                className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Search size={16} />
                {t("common.search") || "Search"}
              </button>

              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className={`h-11 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
                  showFilters
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal size={16} />
                {t("products.filters") || "Filters"}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    {t("products.categories") || "Category"}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">
                      {t("products.allCategories") || "All Categories"}
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                    {t("products.sortBy") || "Sort By"}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 bg-gray-50 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">
                      {t("products.newest") || "Newest"}
                    </option>
                    <option value="oldest">
                      {t("products.oldest") || "Oldest"}
                    </option>
                    <option value="price_asc">
                      {t("products.priceLowToHigh") || "Price: Low to High"}
                    </option>
                    <option value="price_desc">
                      {t("products.priceHighToLow") || "Price: High to Low"}
                    </option>
                    <option value="rating">
                      {t("products.highestRated") || "Highest Rated"}
                    </option>
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="sm:col-span-2 text-sm text-indigo-600 font-medium hover:underline text-left cursor-pointer"
                >
                  {t("products.clearFilters") || "Clear all filters"}
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="bg-white rounded-2xl p-12 text-center text-red-500 border border-gray-100 shadow-sm">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm">
              {t("common.noResults") || "No products found"}
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-150 ${
                  loading ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
              >
                {items.map((item) => {
                  const hasDiscount =
                    item.discountPrice && item.discountPrice < item.price;
                  const displayPrice = hasDiscount
                    ? item.discountPrice
                    : item.price;
                  const discountAmount = hasDiscount
                    ? item.price - item.discountPrice
                    : 0;

                  const tags = Array.isArray(item.tags)
                    ? item.tags.filter(Boolean)
                    : typeof item.tags === "string"
                    ? item.tags
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : [];

                  return (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col"
                    >
                      <div className="relative bg-gray-50">
                        <div className="h-52 overflow-hidden">
                          {item.images?.length > 0 ? (
                            <img
                              src={item.images[0]?.url}
                              alt={item.name || "Product"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-gray-300">
                              <Package size={40} />
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => changeFeatured(item)}
                          className={`absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center transition shadow-sm cursor-pointer ${
                            item.featured
                              ? "bg-amber-50 text-amber-500 border border-amber-200"
                              : "bg-white/90 text-gray-400 hover:text-amber-500"
                          }`}
                        >
                          <Star
                            size={16}
                            fill={item.featured ? "currentColor" : "none"}
                          />
                        </button>

                        <span
                          className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.stock > 0
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-red-50 text-red-600 border border-red-100"
                          }`}
                        >
                          {item.stock > 0
                            ? `${item.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {item.name}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1 capitalize">
                          {[item.category, item.subcategory, item.brand]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>

                        {item.shortDescription && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                            {item.shortDescription}
                          </p>
                        )}

                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-xl font-bold text-gray-900">
                            ${displayPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs font-medium text-emerald-600">
                              -${discountAmount} off
                            </span>
                          )}
                        </div>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[11px] rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-auto pt-4 flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/dashboard/products/${item._id}/view`)
                            }
                            className="flex-1 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Eye size={14} /> View
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/dashboard/products/${item._id}/edit`)
                            }
                            className="flex-1 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <Pencil size={14} /> Edit
                          </button>

                          <button
                            onClick={() => handleQuickEdit(item)}
                            className="h-9 w-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 flex items-center justify-center transition cursor-pointer"
                            title="Quick Edit"
                          >
                            <SlidersHorizontal size={14} />
                          </button>

                          <button
                            onClick={() => handleDelete(item)}
                            className="h-9 w-9 rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalProducts}
                itemsPerPage={LIMIT}
              />
            </>
          )}

          <DeleteConfirmModal
            isOpen={deleteModalOpen}
            productId={selectedProduct?._id}
            productName={selectedProduct?.name}
            onClose={handleCloseDeleteModal}
            onDeleted={handleProductDeleted}
          />

          <QuickEditModal
            isOpen={quickEditOpen}
            productId={quickEditProduct?._id}
            product={quickEditProduct}
            onClose={handleCloseQuickEdit}
            onUpdated={handleProductUpdated}
          />
        </div>
      )}
    </DashboardLayout>
  );
}