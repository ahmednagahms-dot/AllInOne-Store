import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const OFFER_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 أيام
const STORAGE_KEY = "offer_end_time";

const BANNER_IMAGE_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753443/lpx0f1kxvabtd04wycye.webp";

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

export default function OfferBanner() {
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
  }, [endTime, timeLeft.finished]);

  const isFinished = timeLeft.finished;

  return (
    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary-600">
          <div className="grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:gap-4 lg:p-12">
            {/* Left: Text + Countdown */}
            <div className="relative z-10">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-100 sm:text-xs">
                Limited Time Offer
              </span>

              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[42px]">
                Up to 50% Off
                <br />
                Top Brands
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-primary-100 sm:text-[15px]">
                Don't miss out on our biggest sale of the season. Premium
                electronics at record low prices.
              </p>

              {/* Countdown */}
              <div className="mt-6 flex items-center gap-2 sm:gap-3">
                <TimeBox value={timeLeft.days} label="Days" />
                <TimeBox value={timeLeft.hours} label="Hours" />
                <TimeBox value={timeLeft.minutes} label="Minutes" />
                <TimeBox value={timeLeft.seconds} label="Seconds" />
              </div>

              {/* CTA */}
              {isFinished ? (
                <button
                  type="button"
                  disabled
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-6 py-3 text-sm font-bold text-primary-700 cursor-not-allowed"
                >
                  Offer Ended
                </button>
              ) : (
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-primary-600 transition hover:bg-primary-50"
                >
                  Shop the Sale
                  <ArrowRight size={16} />
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