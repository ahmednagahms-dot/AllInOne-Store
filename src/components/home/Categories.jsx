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

// الأقسام الفرعية الحقيقية اللي موجودة في الداتابيز
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
    // بنبعت subcategory في الرابط عشان Shop.jsx يقرأها ويفلتر صح
    navigate(`/shop?subcategory=${encodeURIComponent(item.slug)}`);
  };

  return (
    <a
      href={`/shop?subcategory=${encodeURIComponent(item.slug)}`}
      onClick={handleClick}
      className="group flex min-h-[140px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-primary-500 hover:shadow-lg cursor-pointer"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition group-hover:bg-primary-500 group-hover:text-white">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
    </a>
  );
}

export default function Categories() {
  return (
    <section className="w-full bg-gray-50 py-14 md:py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              Explore
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-500 transition hover:gap-3 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* اتظبطت على lg:grid-cols-7 عشان تتناسب مع عدد الأقسام الفرعية (7 أقسام) */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {SUBCATEGORIES.map((sub) => (
            <CategoryCard key={sub.slug} item={sub} />
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
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