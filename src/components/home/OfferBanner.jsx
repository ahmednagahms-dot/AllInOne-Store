import { useEffect, useMemo, useState } from "react";

import { ArrowRight, Clock } from "lucide-react";

/* =========================================================
   ثوابت
========================================================= */
// مدة العرض: 2 يوم + 18 ساعة + 45 دقيقة + 30 ثانية
const OFFER_DURATION_MS =
  (2 * 24 * 60 * 60 + 18 * 60 * 60 + 45 * 60 + 30) * 1000;

// المفتاح المستخدم في localStorage لحفظ وقت انتهاء العرض
const STORAGE_KEY = "offer_end_time";

/* =========================================================
   دالة حساب الفرق بين وقتين

import { ArrowRight } from "lucide-react";

/* =========================================================
   ثوابت
========================================================= */
const OFFER_DURATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 أيام
const STORAGE_KEY = "offer_end_time";

const BANNER_IMAGE_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1789753443/lpx0f1kxvabtd04wycye.webp";

/* =========================================================
   دالة حساب الفرق

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

   مكوّن صغير لعرض صندوق رقم واحد
========================================================= */
function TimeBox({ value, label }) {
  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
      <span className="text-xl font-bold tabular-nums sm:text-2xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-indigo-100 sm:text-xs">{label}</span>

   صندوق رقم واحد
========================================================= */
function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white/15 px-4 py-2 backdrop-blur-sm sm:px-5 sm:py-3">
      <span className="text-lg font-bold tabular-nums sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-blue-100 sm:text-[10px]">
        {label}
      </span>

    </div>
  );
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
function OfferBanner() {

  // نحسب وقت الانتهاء مرة واحدة فقط (يُحفظ في localStorage)

  // وقت الانتهاء

  const endTime = useMemo(() => {
    if (typeof window === "undefined") return Date.now() + OFFER_DURATION_MS;

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved && Number(saved) > Date.now()) {
      return Number(saved);
    }

    if (saved && Number(saved) > Date.now()) return Number(saved);


    const newEndTime = Date.now() + OFFER_DURATION_MS;
    window.localStorage.setItem(STORAGE_KEY, String(newEndTime));
    return newEndTime;
  }, []);

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));


  // تشغيل العداد
  useEffect(() => {
    // لو خلص بالفعل من أول لحظة
    if (timeLeft.finished) return;

    const intervalId = setInterval(() => {

  useEffect(() => {
    if (timeLeft.finished) return;

    const id = setInterval(() => {

      const next = getTimeLeft(endTime);
      setTimeLeft(next);

      if (next.finished) {

        clearInterval(intervalId);
       clearInterval(id);

        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);


    return () => clearInterval(intervalId);

    return () => clearInterval(id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  const isFinished = timeLeft.finished;

  return (

    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#5046E5] px-6 py-10 text-white sm:px-10 lg:px-14">
          {/* دوائر تزيينية */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
            {/* النصوص */}
            <div className="max-w-xl text-center lg:text-left">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-200">
                Limited Time Offer
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Up to 50% Off Top Brands
              </h2>

              <p className="mt-3 text-sm leading-6 text-indigo-100 sm:text-base">
                Grab amazing deals on the latest technology before the offer
                ends.
              </p>

              <button
                type="button"
                disabled={isFinished}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#5046E5] transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFinished ? "Offer Ended" : "Shop Now"}
                {!isFinished && <ArrowRight size={17} />}
              </button>
            </div>

            {/* العدّاد التنازلي */}
            <div className="flex flex-col items-center">
              <div className="mb-4 flex items-center gap-2 text-sm font-medium text-indigo-100">
                <Clock size={17} />
                <span>{isFinished ? "Offer Has Ended" : "Offer Ends In"}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <TimeBox value={timeLeft.days} label="Days" />
                <span className="text-xl font-bold">:</span>
                <TimeBox value={timeLeft.hours} label="Hours" />
                <span className="text-xl font-bold">:</span>
                <TimeBox value={timeLeft.minutes} label="Minutes" />
                <span className="text-xl font-bold">:</span>
                <TimeBox value={timeLeft.seconds} label="Seconds" />
              </div>
            </div>
          </div>

    <section className="w-full bg-white py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#1E40AF]">
          {/* ============ Grid ============ */}
          <div className="grid grid-cols-1 items-center gap-6 p-6 sm:p-10 lg:grid-cols-2 lg:gap-4 lg:p-12">
            {/* ===== Left: Text + Countdown ===== */}
            <div className="relative z-10">
              {/* Badge */}
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-100 sm:text-xs">
                Limited Time Offer
              </span>

              {/* Title */}
              <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[42px]">
                Up to 50% Off
                <br />
                Top Brands
              </h2>

              {/* Description */}
              <p className="mt-3 max-w-md text-sm leading-6 text-blue-100 sm:text-[15px]">
                Don't miss out on our biggest sale of the season. Premium
                electronics and designer accessories at record low prices.
              </p>

              {/* Countdown */}
              <div className="mt-6 flex items-center gap-2 sm:gap-3">
                <TimeBox value={timeLeft.days} label="Days" />
                <TimeBox value={timeLeft.hours} label="Hours" />
                <TimeBox value={timeLeft.minutes} label="Minutes" />
                <TimeBox value={timeLeft.seconds} label="Seconds" />
              </div>

              {/* CTA */}
              <button
                type="button"
                disabled={isFinished}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1E40AF] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFinished ? "Offer Ended" : "Shop the Sale"}
                {!isFinished && <ArrowRight size={16} />}
              </button>
            </div>

            {/* ===== Right: Image ===== */}
            <div className="relative z-10 lg:justify-self-end">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={BANNER_IMAGE_URL}
                  alt="Limited time offer — up to 50% off"
                  loading="lazy"
                  className="h-full w-full object-cover lg:max-h-[360px] lg:max-w-[520px]"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* ============ Decorative circles ============ */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 left-32 h-48 w-48 rounded-full bg-white/5" />

        </div>
      </div>
    </section>
  );
}

export default OfferBanner;