import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { getProducts } from "../../api/products.api";
import ProductCard from "../products/ProductCard";
import Spinner from "../ui/Spinner";

/* =========================================================
   دالة موحّدة لاستخراج مصفوفة المنتجات من أي شكل رد
========================================================= */
function extractProducts(response) {
  const data = response?.data ?? response;
  const list = data?.products ?? data?.data ?? data ?? [];
  return Array.isArray(list) ? list : [];
}

export default function FeaturedProducts() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // لمنع setState بعد unmount

    const fetchFeatured = async () => {
      setLoading(true);
      setError(null);

      try {
        // محاولة أولى: منتجات مميزة
        const res = await getProducts({ limit: 5, featured: true });
        let list = extractProducts(res).slice(0, 5);

        // لو مفيش نتائج، نجيب أول 5 منتجات عادية
        if (list.length === 0) {
          const fallback = await getProducts({ limit: 5 });
          list = extractProducts(fallback).slice(0, 5);
        }

        if (isMounted) setProducts(list);
      } catch (err) {
        console.error("FeaturedProducts error:", err);

        // محاولة ثانية عند الفشل
        try {
          const fallback = await getProducts({ limit: 5 });
          const list = extractProducts(fallback).slice(0, 5);
          if (isMounted) setProducts(list);
        } catch (e) {
          if (isMounted) setError(t("featured.error"));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, [t]);

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-14 md:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* ===================== Header ===================== */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              {t("featured.tag")}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {t("featured.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {t("featured.subtitle")}
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition-all hover:gap-3 sm:flex"
          >
            {t("common.viewAll")}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>

        {/* ===================== Content ===================== */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={36} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 dark:border-red-950/40 bg-red-50 dark:bg-red-950/20 py-12 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 py-12 text-center text-sm text-gray-500 dark:text-slate-400">
            {t("featured.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* ===================== Mobile View All ===================== */}
        <div className="mt-7 flex justify-center sm:hidden">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-primary-500"
          >
            {t("common.viewAll")}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}