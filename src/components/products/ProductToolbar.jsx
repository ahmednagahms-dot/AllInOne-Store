import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Grid, List, Filter } from "lucide-react";

export default function ProductToolbar({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  onFilterToggle,
}) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search
          className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
          size={18}
        />
        <input
          type="text"
          placeholder={t("shop.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm shadow-sm"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        {/* Sort Select */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm text-gray-500 dark:text-slate-400">{t("shop.sortBy")}</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="py-2 px-3 pr-8 rtl:pr-3 rtl:pl-8 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 text-sm font-medium cursor-pointer shadow-sm appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: isArabic ? "left 0.5rem center" : "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="popular" className="dark:bg-slate-900">{t("shop.sortPopular")}</option>
            <option value="newest" className="dark:bg-slate-900">{t("shop.sortNewest")}</option>
            <option value="price-asc" className="dark:bg-slate-900">{t("shop.sortPriceAsc")}</option>
            <option value="price-desc" className="dark:bg-slate-900">{t("shop.sortPriceDesc")}</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl p-1 border border-gray-200 dark:border-slate-800 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-800 shadow text-[#5046E5] dark:text-indigo-400"
                : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-800 shadow text-[#5046E5] dark:text-indigo-400"
                : "text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
            }`}
          >
            <List size={18} />
          </button>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          type="button"
          onClick={onFilterToggle}
          className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition shadow-sm lg:hidden cursor-pointer"
        >
          <Filter size={16} />
          <span>{t("shop.filter")}</span>
        </button>
      </div>
    </div>
  );
}