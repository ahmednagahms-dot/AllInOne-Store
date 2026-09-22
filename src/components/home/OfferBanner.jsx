import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

/* =========================================================
   Constants
========================================================= */
const OFFER_DURATION_MS =
  (2 * 24 * 60 * 60 + 18 * 60 * 60 + 45 * 60 + 30) * 1000;


const STORAGE_KEY = "offer_end_time";

const BANNER_IMAGE_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753443/lpx0f1kxvabtd04wycye.webp";

/* =========================================================
   Time difference helper
========================================================= */
function getTimeLeft(targetTime) {
  const diff = Math.max(0, targetTime - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    finished: diff <= 0,
  };
}

/* =========================================================
   Small component: single time box
========================================================= */
function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
      <span className="text-lg font-bold tabular-nums text-white sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary-100 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   Main component
========================================================= */
export default function OfferBanner() {
  const { t } = useTranslation();

  // Compute end time only once (persisted in localStorage)
  const endTime = useMemo(() => {
    if (typeof window === "undefined") return Date.now() + OFFER_DURATION_MS;

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved && Number(saved) > Date.now()) {
      return Number(saved);
    }

    const newEndTime = Date.now() + OFFER_DURATION_MS;
    window.localStorage.setItem(STORAGE_KEY, String(newEndTime));
    return newEndTime;
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));

  // Countdown timer
  useEffect(() => {
    if (timeLeft.finished) return;

    const id = setInterval(() => {
      const next = getTimeLeft(endTime);
      setTimeLeft(next);

      if (next.finished) {
        clearInterval(id);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  const isFinished = timeLeft.finished;

  return (
    <section className="w-full bg-white dark:bg-slate-950 py-10 sm:py-14 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-blue-500 dark:bg-slate-900">
          <div className="grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:gap-4 lg:p-12">
            {/* Left: Text + Countdown */}
            <div className="relative z-10">
              <span className="offer-badge-animate inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-100 sm:text-xs">
                {t("offer.badge")}
              </span>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[42px]">
                {t("offer.title")}
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-primary-100 sm:text-[15px]">
                {t("offer.description")}
              </p>

              {/* Countdown */}
              <div className="mt-6 flex items-center gap-2 sm:gap-3">
                <TimeBox value={timeLeft.days} label={t("offer.days")} />
                <TimeBox value={timeLeft.hours} label={t("offer.hours")} />
                <TimeBox value={timeLeft.minutes} label={t("offer.minutes")} />
                <TimeBox value={timeLeft.seconds} label={t("offer.seconds")} />
              </div>

              {/* CTA */}
              {isFinished ? (
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-6 py-3 text-sm font-bold text-primary-700 cursor-not-allowed"
                >
                  {t("offer.offerEnded")}
                </button>
              ) : (
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
                >
                  {t("offer.shopSale")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </Link>
              )}
            </div>

            {/* Right: Image */}
            <div className="relative z-10 lg:justify-self-end">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={BANNER_IMAGE_URL}
                  alt="Limited time offer"
                  loading="lazy"
                  className="h-full w-full object-cover lg:max-h-[360px] lg:max-w-[520px]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 left-32 h-48 w-48 rounded-full bg-white/5" />
        </div>
      </div>
    </section>
  );
}