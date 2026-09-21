
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Package, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Watch, 
  Gamepad2, 
  Tablet 
} from "lucide-react";

const SUBCATEGORIES = [
  { name: "Audio", slug: "audio", icon: Headphones },
  { name: "Smartphones", slug: "smartphones", icon: Smartphone },
  { name: "Laptops", slug: "laptops", icon: Laptop },
  { name: "Tablets", slug: "tablets", icon: Tablet },
  { name: "Watches", slug: "watches", icon: Watch },
  { name: "Macbook", slug: "macbook", icon: Laptop },
  { name: "Accessories", slug: "accessories", icon: Package },
];

function CategoryCard({ item }) {
  const Icon = item.icon || Package;
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/shop?subcategory=${encodeURIComponent(item.slug)}`);
  };

  return (
    <a
      href={`/shop?subcategory=${encodeURIComponent(item.slug)}`}
      onClick={handleClick}
      className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg cursor-pointer"
=======
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
      className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-500 dark:hover:border-indigo-500/50 hover:shadow-lg dark:hover:shadow-indigo-950/20"

    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-indigo-950/50 text-primary-500 dark:text-indigo-400 transition group-hover:bg-primary-500 group-hover:text-white">
        <Icon size={22} strokeWidth={1.8} />
      </div>

      <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
    </a>

      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
    </Link>

  );
}

export default function Categories() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-gray-50 dark:bg-slate-950 py-14 md:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              {t("categories.tag")}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
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


        {/* خليناها lg:grid-cols-7 عشان هما 7 أقسام فرعية فيتوزعوا بشكل متناسق */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {SUBCATEGORIES.map((sub) => (
            <CategoryCard key={sub.slug} item={sub} />

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