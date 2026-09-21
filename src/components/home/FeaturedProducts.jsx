import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
        const res = await getProducts({ limit: 4, featured: true });
        let list = extractProducts(res).slice(0, 4);

        // لو مفيش نتائج، نجيب أول 4 منتجات عادية
        if (list.length === 0) {
          const fallback = await getProducts({ limit: 4 });
          list = extractProducts(fallback).slice(0, 4);
        }

        if (isMounted) setProducts(list);
      } catch (err) {
        console.error("FeaturedProducts error:", err);

        // محاولة ثانية عند الفشل
        try {
          const fallback = await getProducts({ limit: 4 });
          const list = extractProducts(fallback).slice(0, 4);
          if (isMounted) setProducts(list);
        } catch (e) {
          if (isMounted) setError("فشل تحميل المنتجات، حاول مرة أخرى");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-white py-14 md:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* ===================== Header ===================== */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              Featured
            </p>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Discover our most popular products
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition-all hover:gap-3 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ===================== Content ===================== */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size={36} />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 py-12 text-center text-sm text-gray-500">
            لا توجد منتجات مميزة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
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
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}