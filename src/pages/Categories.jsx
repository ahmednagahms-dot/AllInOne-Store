import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Package, Search, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import CategoryFormModal from "../components/categories/CategoryFormModal";
import {
  getCustomCategories,
  removeCustomCategory,
} from "../data/customCategories";
import api from "../api/axios";
import PageLoader from "../components/ui/sessionLoader/PageLoader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Categories() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [customCats, setCustomCats] = useState(getCustomCategories());

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products", { params: { limit: 500 } });
        setProducts(response.data.products || []);
        setError(null);
      } catch (err) {
        setError(t("errors.loadCategories"));
         toast.error(t("errors.loadCategories"));
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const categoriesData = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category?.trim();
      if (!cat) return;
      if (!map[cat])
        map[cat] = {
          name: cat,
          count: 0,
          inStock: 0,
          image: null,
          isCustom: false,
        };
      map[cat].count += 1;
      if (p.stock > 0) map[cat].inStock += 1;
      if (!map[cat].image && p.images?.[0]?.url)
        map[cat].image = p.images[0].url;
    });

    customCats.forEach((cat) => {
      if (!map[cat])
        map[cat] = {
          name: cat,
          count: 0,
          inStock: 0,
          image: null,
          isCustom: true,
        };
    });

    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [products, customCats]);

  const filteredCategories = useMemo(() => {
    return categoriesData.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categoriesData, search]);

  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("pages.loadingCategories")} />
      ) : (
        <div className="p-4 sm:p-6 w-full animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-primary-500 tracking-widest uppercase">
                {t("pages.catalog")}
              </p>
              <h1 className="text-2xl font-bold">{t("pages.categories")}</h1>
              <p className="text-sm text-gray-500">
                {t("pages.categoryDescription")}
              </p>
            </div>

            <button
              onClick={() => setShowFormModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
            >
              <Plus size={16} /> {t("pages.addCategory")}
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                placeholder={t("pages.searchCategories")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">
              {t("pages.loadingCategories")}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100">
              {t("pages.noCategories")}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => (
                <div key={cat.name} className="relative group">
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/products?category=${encodeURIComponent(
                          cat.name
                        )}`
                      )
                    }
                    className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 p-5 text-left transition flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Layers size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 capitalize truncate">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Package size={12} /> {t("pages.productsCount", { count: cat.count })}
                      </p>
                      <p className="text-xs text-success mt-0.5">
                        {cat.inStock} {t("pages.inStock")}
                      </p>
                    </div>
                  </button>

                  {cat.isCustom && cat.count === 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomCats(removeCustomCategory(cat.name));
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                      title="Delete Category"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <CategoryFormModal
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            onSaved={() => setCustomCats(getCustomCategories())}
          />
        </div>
      )}
    </DashboardLayout>
  );
}