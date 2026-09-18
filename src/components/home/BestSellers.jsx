import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getProducts } from "../../api/products.api";
import ProductCard from "../products/ProductCard";
import Spinner from "../ui/Spinner";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
      
        const { data } = await getProducts({ limit: 10 });
        const list = data.products || data.data || data || [];
        const sliced = Array.isArray(list) ? list.slice(3, 8) : [];
        setProducts(sliced.length > 0 ? sliced : list.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError("فشل تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="w-full bg-gray-50 py-14 md:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              Popular
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Best Sellers
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Our customers&apos; favorite picks
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition hover:gap-3 sm:flex"
          >
            View All
            <ArrowRight size={16} />
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
            لا توجد منتجات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}