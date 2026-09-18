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
    </div>
  );
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
function OfferBanner() {
  // نحسب وقت الانتهاء مرة واحدة فقط (يُحفظ في localStorage)
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

  // تشغيل العداد
  useEffect(() => {
    // لو خلص بالفعل من أول لحظة
    if (timeLeft.finished) return;

    const intervalId = setInterval(() => {
      const next = getTimeLeft(endTime);
      setTimeLeft(next);

      if (next.finished) {
        clearInterval(intervalId);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);

    return () => clearInterval(intervalId);
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
        </div>
      </div>
    </section>
  );
}

export default OfferBanner;