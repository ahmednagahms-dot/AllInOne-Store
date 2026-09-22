import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "New Arrival",
    title: "Upgrade Your Style with the Latest Tech",
    highlight: "Latest Tech",
    description:
      "Discover the newest smartphones, laptops and accessories with unbeatable deals and fast doorstep delivery.",
    image:
      "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753946/qke8ntgsk87oo8b2qum1.webp",
    discount: "40%",
  },
  {
    id: 2,
    badge: "Smart Electronics",
    title: "Upgrade Your World with Smart Electronics",
    highlight: "Smart Electronics",
    description:
      "Explore premium electronics designed to make your everyday life smarter, easier, and more stylish.",
    image:
      "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753946/qh49z65ca6yyihe5yvow.png",
    discount: "30%",
  },
  {
    id: 3,
    badge: "Best Deals",
    title: "Premium Products at Unbeatable Prices",
    highlight: "Unbeatable Prices",
    description:
      "Shop our curated collection of top-rated products with free shipping on orders over $50.",
    image:
      "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753946/qke8ntgsk87oo8b2qum1.webp",
    discount: "50%",
  },
];

const AUTOPLAY_MS = 5000;

function Benefit({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-[#5046E5] dark:text-indigo-400 shadow-sm">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900 dark:text-slate-100">{title}</p>
        <p className="text-[11px] text-gray-400 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

function HighlightedTitle({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) return <>{title}</>;
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="text-blue-600">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function Hero() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("ar");
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slide = SLIDES[index];
  const total = SLIDES.length;

  const currentBadge = t(`hero.slides.${slide.id}.badge`, { defaultValue: slide.badge });
  const currentTitle = t(`hero.slides.${slide.id}.title`, { defaultValue: slide.title });
  const currentHighlight = t(`hero.slides.${slide.id}.highlight`, { defaultValue: slide.highlight });
  const currentDescription = t(`hero.slides.${slide.id}.description`, { defaultValue: slide.description });

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [next, isPaused]);

  return (
    <section className="w-full overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 md:py-8 lg:py-10">
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/40 border border-slate-200/50 dark:border-slate-800"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid min-h-[420px] grid-cols-1 items-center lg:grid-cols-2">
            {/* Content Side */}
            <div className="relative z-10 px-6 py-10 sm:px-10 md:px-12 lg:px-14 lg:py-12">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 px-3 py-1.5 shadow-sm border border-slate-200/40 dark:border-slate-700/50">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-500">
                  {currentBadge}
                </span>
              </div>

              <h1 className="max-w-[520px] text-3xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[42px]">
                <HighlightedTitle
                  title={currentTitle}
                  highlight={currentHighlight}
                />
              </h1>

              <p className="mt-4 max-w-[460px] text-sm leading-relaxed text-gray-500 dark:text-slate-300 sm:text-[15px]">
                {currentDescription}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  {t("hero.shopNow")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-blue-600 bg-white dark:bg-slate-900 px-6 text-sm font-semibold text-blue-600 dark:text-indigo-400 transition hover:bg-primary-50 dark:hover:bg-slate-800"
                >
                  {t("hero.exploreCollections")}
                </Link>
              </div>

              <div className="mt-8 grid max-w-[520px] grid-cols-1 gap-4 border-t border-primary-100 dark:border-slate-800 pt-6 sm:grid-cols-3">
                <Benefit
                  icon={ShieldCheck}
                  title={t("hero.benefits.qualityTitle")}
                  subtitle={t("hero.benefits.qualitySub")}
                />
                <Benefit
                  icon={Truck}
                  title={t("hero.benefits.deliveryTitle")}
                  subtitle={t("hero.benefits.deliverySub")}
                />
                <Benefit
                  icon={RotateCcw}
                  title={t("hero.benefits.returnsTitle")}
                  subtitle={t("hero.benefits.returnsSub")}
                />
              </div>
            </div>

            {/* Media Side */}
            <div className="relative flex min-h-[300px] items-center justify-center px-8 pb-10 pt-4 lg:min-h-[420px] lg:pb-0">
              <div className="absolute right-[8%] rtl:right-auto rtl:left-[8%] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-white/60 dark:bg-slate-800/60 sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]" />

              <div className="relative z-10 h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] lg:h-[310px] lg:w-[310px]">
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={currentTitle}
                  className="h-full w-full object-contain drop-shadow-xl transition duration-500"
                />
              </div>

              <div className="absolute right-[10%] rtl:right-auto rtl:left-[10%] top-[10%] z-20 flex h-16 w-16 rotate-6 rtl:-rotate-6 items-center justify-center rounded-full bg-primary-500 text-center text-white shadow-lg sm:h-[72px] sm:w-[72px]">
                <div>
                  <p className="text-[9px] font-bold uppercase text-white/80">
                    {t("hero.upTo")}
                  </p>
                  <p className="text-lg font-extrabold leading-none">
                    {slide.discount}
                  </p>
                  <p className="text-[8px] font-semibold uppercase">{t("hero.off")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={isRTL ? next : prev}
            aria-label="Previous"
            className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex cursor-pointer"
          >
            {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            type="button"
            onClick={isRTL ? prev : next}
            aria-label="Next"
            className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex cursor-pointer"
          >
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === index
                    ? "w-5 bg-primary-500"
                    : "w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}