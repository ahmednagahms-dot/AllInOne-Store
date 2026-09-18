import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-primary-500 shadow-sm">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function HighlightedTitle({ title, highlight }) {
  if (!highlight || !title.includes(highlight)) {
    return <>{title}</>;
  }
  const parts = title.split(highlight);
  return (
    <>
      {parts[0]}
      <span className="text-primary-500">{highlight}</span>
      {parts[1]}
    </>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slide = SLIDES[index];
  const total = SLIDES.length;

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
    <section className="w-full overflow-hidden bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 md:py-8 lg:py-10">
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid min-h-[420px] grid-cols-1 items-center lg:grid-cols-2">
            {/* ===== Left: Text ===== */}
            <div className="relative z-10 px-6 py-10 sm:px-10 md:px-12 lg:px-14 lg:py-12">
              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-500">
                  {slide.badge}
                </span>
              </div>

              {/* Title */}
              <h1 className="max-w-[520px] text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[42px]">
                <HighlightedTitle
                  title={slide.title}
                  highlight={slide.highlight}
                />
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-[460px] text-sm leading-relaxed text-gray-500 sm:text-[15px]">
                {slide.description}
              </p>

              {/* Buttons */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                >
                  Shop Now
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-primary-500 bg-white px-6 text-sm font-semibold text-primary-500 transition hover:bg-primary-50"
                >
                  Explore Collections
                </Link>
              </div>

              {/* Benefits */}
              <div className="mt-8 grid max-w-[520px] grid-cols-1 gap-4 border-t border-primary-100 pt-6 sm:grid-cols-3">
                <Benefit
                  icon={ShieldCheck}
                  title="Premium Quality"
                  subtitle="Guaranteed"
                />
                <Benefit
                  icon={Truck}
                  title="Fast Delivery"
                  subtitle="2–5 Business Days"
                />
                <Benefit
                  icon={RotateCcw}
                  title="Easy Returns"
                  subtitle="30 Days"
                />
              </div>
            </div>

            {/* ===== Right: Image ===== */}
            <div className="relative flex min-h-[300px] items-center justify-center px-8 pb-10 pt-4 lg:min-h-[420px] lg:pb-0">
              {/* Circle background */}
              <div className="absolute right-[8%] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full bg-white/60 sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px]" />

              {/* Product */}
              <div className="relative z-10 h-[240px] w-[240px] sm:h-[280px] sm:w-[280px] lg:h-[310px] lg:w-[310px]">
                <img
                  key={slide.id}
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-contain drop-shadow-xl transition duration-500"
                />
              </div>

              {/* Discount Badge */}
              <div className="absolute right-[10%] top-[10%] z-20 flex h-16 w-16 rotate-6 items-center justify-center rounded-full bg-primary-500 text-center text-white shadow-lg sm:h-[72px] sm:w-[72px]">
                <div>
                  <p className="text-[9px] font-bold uppercase text-white/80">
                    Up to
                  </p>
                  <p className="text-lg font-extrabold leading-none">
                    {slide.discount}
                  </p>
                  <p className="text-[8px] font-semibold uppercase">Off</p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 z-30 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-800 shadow-md transition hover:bg-primary-500 hover:text-white sm:flex"
          >
            <ChevronRight size={16} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-5 bg-primary-500"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}