import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-orb-1" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl animate-orb-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-400/5 dark:bg-violet-500/5 rounded-full blur-3xl animate-orb-3" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(37,99,235,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400/30 dark:bg-blue-400/20 rounded-full animate-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 number with glitch effect */}
        <div className="relative mb-2">
          <h1 className="text-[10rem] sm:text-[13rem] font-black leading-none tracking-tighter select-none bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent animate-gradient-shift">
            404
          </h1>
          {/* Shadow text */}
          <h1
            className="absolute inset-0 text-[10rem] sm:text-[13rem] font-black leading-none tracking-tighter select-none text-blue-600/5 dark:text-blue-400/5 blur-sm"
            aria-hidden="true"
          >
            404
          </h1>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/50" />
          <Search className="w-5 h-5 text-blue-500/60 animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/50" />
        </div>

        {/* Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          {t("notFound.title")}
        </h2>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
          {t("notFound.description")}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span>{t("notFound.goHome")}</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-200 font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            <span>{t("notFound.goBack")}</span>
          </button>
        </div>

        {/* Error code badge */}
        <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            {t("notFound.errorBadge")}
          </span>
        </div>
      </div>
    </div>
  );
}
