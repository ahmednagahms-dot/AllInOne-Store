import { Quote, Star } from "lucide-react";
import reviews from "../../data/reviews";

function CustomerReviews() {
    return (
        <section className="w-full bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            {/* Header */}
            <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
                Testimonials
            </p>

            <h2 className="text-3xl font-bold text-[#0F172A]">
                What Our Customers Say
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                See what our customers have to say about their shopping experience.
            </p>
            </div>

            {/* Reviews */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
                <div
                key={review.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                {/* Quote */}
                <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5046E5]">
                    <Quote size={17} />
                </div>

                {/* Rating */}
                <div className="mb-5 flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                        key={index}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                    />
                    ))}
                </div>

                {/* Review Text */}
                <p className="min-h-[96px] text-sm leading-6 text-slate-600">
                    &quot;{review.review}&quot;
                </p>

                {/* Customer */}
                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5046E5] text-sm font-bold text-white">
                    {review.avatar}
                    </div>

                    <div>
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                        {review.name}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                        {review.role}
                    </p>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </section>
    );
}

export default CustomerReviews;