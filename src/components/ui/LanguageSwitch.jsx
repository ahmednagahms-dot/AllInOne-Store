import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentLanguage = i18n.language === "ar" ? "العربية" : "English";

  return (
    <div className="relative" ref={menuRef}>
      {/* Language Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        aria-label={i18n.language === "ar" ? "تغيير اللغة" : "Change language"}
      >
        <Globe size={20} />

        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-lg">
          {/* English */}
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>English</span>

            {i18n.language === "en" && <Check size={16} />}
          </button>

          {/* Arabic */}
          <button
            type="button"
            onClick={() => changeLanguage("ar")}
            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span>العربية</span>

            {i18n.language === "ar" && <Check size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
