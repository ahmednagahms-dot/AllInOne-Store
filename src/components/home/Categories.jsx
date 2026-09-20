import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Package,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  { key: "electronics", slug: "electronics", icon: Headphones },
  { key: "fashion", slug: "fashion", icon: Package },
  { key: "home", slug: "home", icon: HomeIcon },
  { key: "beauty", slug: "beauty", icon: Sparkles },
  { key: "mobiles", slug: "mobiles", icon: Smartphone },
  { key: "laptops", slug: "laptops", icon: Laptop },
  { key: "watches", slug: "watches", icon: Watch },
  { key: "gaming", slug: "gaming", icon: Gamepad2 },
];

function CategoryCard({ category, title }) {
  const Icon = category.icon || Package;

  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.slug)}`}
      className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition group-hover:bg-primary-500 group-hover:text-white">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    </Link>
  );
}

export default function Categories() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-gray-50 py-14 md:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              {t("categories.tag")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("categories.title")}
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition hover:gap-3 sm:flex"
          >
            {t("common.viewAll")}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              title={t(`categories.items.${category.key}`)}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
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