import { ArrowRight } from "lucide-react";
import products from "../../data/products";
import ProductCard from "../products/ProductCard";

function BestSellers() {
  // نستخدم المنتجات من رقم 4 إلى 8 كـ Best Sellers
    const bestSellers = products.slice(3, 8);

    return (
        <section className="w-full bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between">
            <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
                Popular
                </p>

                <h2 className="text-3xl font-bold text-[#0F172A]">
                Best Sellers
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                Our customers&apos; favorite picks
                </p>
            </div>

            <a
                href="#shop"
                className="hidden items-center gap-2 text-sm font-semibold text-[#5046E5] transition hover:gap-3 sm:flex"
            >
                View All
                <ArrowRight size={16} />
            </a>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {bestSellers.map((product) => (
                <ProductCard
                key={product.id}
                product={product}
                />
            ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-7 flex justify-center sm:hidden">
            <a
                href="#shop"
                className="flex items-center gap-2 text-sm font-semibold text-[#5046E5]"
            >
                View All
                <ArrowRight size={16} />
            </a>
            </div>
        </div>
        </section>
    );
}

export default BestSellers;