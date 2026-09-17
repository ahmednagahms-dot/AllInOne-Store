import { ArrowRight } from "lucide-react";
import categories from "../../data/categories";

function Categories() {
    return (
        <section className="w-full bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            {/* Section Header */}
            <div className="mb-8 flex items-end justify-between">
            <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
                Explore
                </p>

                <h2 className="text-3xl font-bold text-[#0F172A]">
                Shop by Category
                </h2>
            </div>

            <a
                href="#shop"
                className="hidden items-center gap-2 text-sm font-semibold text-[#5046E5] transition hover:gap-3 sm:flex"
            >
                View All
                <ArrowRight size={16} />
            </a>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => {
                const Icon = category.icon;

                return (
                <div
                    key={category.id}
                    className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#5046E5] hover:shadow-lg"
                >
                    {/* Icon */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5046E5] transition group-hover:bg-[#5046E5] group-hover:text-white">
                    <Icon size={22} strokeWidth={1.8} />
                    </div>

                    {/* Category Name */}
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                    {category.name}
                    </h3>

                    {/* Products Count */}
                    <p className="mt-1 text-xs text-slate-400">
                    {category.products}
                    </p>
                </div>
                );
            })}
            </div>

            {/* Mobile View All */}
            <div className="mt-6 flex justify-center sm:hidden">
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

export default Categories;