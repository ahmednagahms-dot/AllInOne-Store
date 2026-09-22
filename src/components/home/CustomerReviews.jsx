import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Quote, Star, User, AlertCircle } from "lucide-react";
import { getAllReviews } from "../../api/reviews.api";
import fallbackReviews from "../../data/reviews";

const arabicFallbackReviews = [
  {
    id: 1,
    name: "أحمد محمد",
    role: "مشتري موثّق",
    review:
      "تجربة تسوق رائعة! وصل المنتج بسرعة وكان مطابقاً تماماً للوصف وجودته ممتازة جداً.",
    rating: 5,
    avatar: "أم",
  },
  {
    id: 2,
    name: "سارة علي",
    role: "مشترية موثّقة",
    review:
      "جودة عالية وخدمة عملاء راقية وسريعة الاستجابة. بالتأكيد سأكرر تجربة الشراء من هنا.",
    rating: 5,
    avatar: "سع",
  },
  {
    id: 3,
    name: "عمر حسن",
    role: "مشتري موثّق",
    review:
      "المتجر سهل وسلس في الاستخدام وطلبي وصل بحالة ممتازة ومغلف بإتقان. تجربة موفقة للغاية.",
    rating: 5,
    avatar: "عح",
  },
];

/* =========================================================
   نجوم التقييم بأمان
========================================================= */
function RatingStars({ rating = 5 }) {
  const safe = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <div className="mb-5 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < safe
              ? "fill-yellow-400 text-yellow-400"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          }
        />
      ))}
    </div>
  );
}

/* =========================================================
   بطاقة مراجعة
========================================================= */
function ReviewCard({ review }) {
  const { t } = useTranslation();

  const name =
    review.name ||
    review.user?.name ||
    review.customerName ||
    t("reviews.anonymous");

  const role =
    review.role ||
    review.user?.role ||
    (review.verified ? t("reviews.verifiedBuyer") : t("reviews.customer"));

  const text =
    review.review || review.text || review.comment || review.content || "";

  const rating = review.rating ?? review.stars ?? 5;

  const avatar =
    review.avatar || review.user?.avatar || review.user?.image || null;

  const isAvatarImage =
    typeof avatar === "string" && /^(https?:\/\/|data:)/.test(avatar);

  return (
    <div className="relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-indigo-950/20 shadow-sm">
      <div className="absolute right-5 rtl:right-auto rtl:left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] dark:bg-blue-600/10 text-blue-600 dark:text-blue-600">
        <Quote size={17} className="rtl:rotate-180" />
      </div>

      <RatingStars rating={rating} />

      <p className="line-clamp-4 min-h-[96px] text-sm leading-6 text-slate-600 dark:text-slate-300">
        &ldquo;{text}&rdquo;
      </p>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-bold text-white">
          {isAvatarImage ? (
            <img
              src={avatar}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.textContent =
                  name.charAt(0).toUpperCase();
              }}
            />
          ) : avatar ? (
            <span>{avatar}</span>
          ) : (
            <User size={18} />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#0F172A] dark:text-slate-100">
            {name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Skeleton
========================================================= */
function ReviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
        >
          <div className="mb-5 flex gap-1">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-4/6 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
            <div className="h-11 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-2 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   استخراج مصفوفة المراجعات من أي شكل رد
========================================================= */
function extractReviews(response) {
  const data = response?.data ?? response;
  const list =
    data?.reviews ??
    data?.data ??
    data?.results ??
    data ??
    [];
  return Array.isArray(list) ? list : [];
}

/* =========================================================
   المكوّن الرئيسي
========================================================= */
function CustomerReviews() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language?.startsWith("ar");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const defaultList = isArabic ? arabicFallbackReviews : fallbackReviews;

    const fetchReviews = async () => {
      try {
        const res = await getAllReviews({ limit: 3 });
        const list = extractReviews(res);

        if (isMounted) {
          if (list.length > 0) {
            setReviews(list.slice(0, 3));
          } else {
            setReviews(defaultList.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Reviews fetch error:", err);
        if (isMounted) {
          setReviews(defaultList.slice(0, 3));
          setError(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [isArabic]);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="w-full bg-[#F8FAFC] dark:bg-slate-950 py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* ============ Header ============ */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            {t("reviews.tag")}
          </p>

          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
            {t("reviews.title")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            {t("reviews.subtitle")}
          </p>
        </div>

        {/* ============ Content ============ */}
        {loading ? (
          <ReviewSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 dark:border-red-950/40 bg-red-50 dark:bg-red-950/20 py-12 text-center">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <ReviewCard
                key={review._id ?? review.id ?? index}
                review={review}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerReviews;