import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-[#5046E5] dark:hover:text-indigo-400 transition shadow-sm bg-white dark:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronLeft size={18} className="rtl:rotate-180" />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 flex items-center justify-center rounded-full font-medium text-sm transition shadow-sm cursor-pointer ${
            currentPage === page
              ? "bg-[#5046E5] text-white shadow-md shadow-indigo-500/20"
              : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-[#5046E5] dark:hover:text-indigo-400 transition shadow-sm bg-white dark:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <ChevronRight size={18} className="rtl:rotate-180" />
      </button>
    </div>
  );
}