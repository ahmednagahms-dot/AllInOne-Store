import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme, theme } = useTheme();
  const { i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");

  const title = isArabic
    ? isDark
      ? "التبديل إلى الوضع الفاتح"
      : "التبديل إلى الوضع الداكن"
    : isDark
    ? "Switch to Light mode"
    : "Switch to Dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 active:scale-95 cursor-pointer ${className}`}
      aria-label={title}
      title={title}
    >
      {isDark ? (
        <Sun size={15} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-slate-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
