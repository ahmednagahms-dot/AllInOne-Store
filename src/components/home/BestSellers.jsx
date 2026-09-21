import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { getProducts } from "../../api/products.api";
import ProductCard from "../products/ProductCard";
import Spinner from "../ui/Spinner";

export default function BestSellers() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await getProducts({ limit: 10 });
        const list = data.products || data.data || data || [];
        const sliced = Array.isArray(list) ? list.slice(3, 7) : [];
        setProducts(sliced.length > 0 ? sliced : list.slice(0, 4));
      } catch (err) {
        console.error(err);
        setError(t("bestSellers.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, [t]);

  return (
    <section className="w-full bg-gray-50 dark:bg-slate-950 py-14 md:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              {t("bestSellers.tag")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t("bestSellers.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              {t("bestSellers.subtitle")}
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition hover:gap-3 sm:flex"
          >
            {t("common.viewAll")}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={36} />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-danger text-sm">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            {t("bestSellers.empty")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All */}
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