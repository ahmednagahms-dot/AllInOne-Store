import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, AlertCircle, Loader2 } from "lucide-react";
import { getCategories } from "../../api/categories.api";
import fallbackCategories from "../../data/categories";

/* =========================================================
   قائمة الأيقونات — نختار حسب اسم الفئة
========================================================= */
import {
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Tv,
  Tablet,
  Shirt,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";

const ICON_MAP = {
  mobiles: Smartphone,
  mobile: Smartphone,
  phones: Smartphone,
  laptops: Laptop,
  laptop: Laptop,
  computers: Laptop,
  headphones: Headphones,
  audio: Headphones,
  watches: Watch,
  watch: Watch,
  cameras: Camera,
  camera: Camera,
  gaming: Gamepad2,
  games: Gamepad2,
  tvs: Tv,
  tv: Tv,
  tablets: Tablet,
  tablet: Tablet,
  clothes: Shirt,
  fashion: Shirt,
  home: HomeIcon,
  beauty: Sparkles,
};

function pickIcon(name = "") {
  const key = name.toLowerCase().trim().replace(/\s+/g, "");
  return ICON_MAP[key] || Package;
}

/* =========================================================
   بطاقة فئة واحدة
========================================================= */
function CategoryCard({ category }) {
  const name = category.name || category.title || "فئة";
  const productsCount = category.productsCount ?? category.products;
  const slug =
    category.slug ||
    name.toLowerCase().replace(/\s+/g, "-");

  const linkTo = `/shop?category=${encodeURIComponent(slug)}`;

  const Icon = category.icon || pickIcon(name);

  return (
    <Link
      to={linkTo}
      className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#5046E5] hover:shadow-lg"
    >
      {/* Icon */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5046E5] transition group-hover:bg-[#5046E5] group-hover:text-white">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      {/* Category Name */}
      <h3 className="text-sm font-semibold text-[#0F172A]">{name}</h3>

      {/* Products Count */}
      {productsCount !== undefined && productsCount !== null && (
        <p className="mt-1 text-xs text-slate-400">
          {typeof productsCount === "number"
            ? `${productsCount} منتج`
            : productsCount}
        </p>
      )}
    </Link>
  );
}

/* =========================================================
   Skeleton Loading
========================================================= */
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-[150px] animate-pulse flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-4 h-12 w-12 rounded-full bg-slate-200" />
          <div className="h-3 w-16 rounded bg-slate-200" />
          <div className="mt-2 h-2 w-12 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   استخراج مصفوفة الفئات من أي شكل رد
========================================================= */
function extractCategories(response) {
  const data = response?.data ?? response;
  const list = data?.categories ?? data?.data ?? data ?? [];
  return Array.isArray(list) ? list : [];
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getCategories();
        const list = extractCategories(res);

        if (isMounted) {
          if (list.length > 0) {
            setCategories(list);
          } else {
            // الـ API رجع فاضي → نستخدم البيانات الثابتة
            setCategories(fallbackCategories);
          }
        }
      } catch (err) {
        console.error("Categories fetch error:", err);
        if (isMounted) {
          // فشل الـ API → نستخدم البيانات الثابتة (مش بنعرض error)
          setCategories(fallbackCategories);
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // نعرض بحد أقصى 8 فئات
  const visibleCategories = useMemo(
    () => categories.slice(0, 8),
    [categories]
  );

  // لو مفيش فئات خالص (لا من API ولا fallback)، منعرضش السكشن
  if (!loading && visibleCategories.length === 0) return null;

  return (
    <section className="w-full bg-[#F8FAFC] py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* ============ Header ============ */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
              Explore
            </p>
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-[#5046E5] transition-all hover:gap-3 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* ============ Content ============ */}
        {loading ? (
          <CategorySkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-12 text-center">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {visibleCategories.map((category) => (
              <CategoryCard
                key={
                  category._id ??
                  category.id ??
                  category.slug ??
                  category.name
                }
                category={category}
              />
            ))}
          </div>
        )}

        {/* ============ Mobile View All ============ */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-[#5046E5]"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Categories;