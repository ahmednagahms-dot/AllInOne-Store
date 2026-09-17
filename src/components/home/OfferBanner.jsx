import { ArrowRight, Clock } from "lucide-react";

function OfferBanner() {
    return (
        <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-[#5046E5] px-6 py-10 text-white sm:px-10 lg:px-14">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
                {/* Text */}
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
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#5046E5] transition hover:bg-slate-100"
                >
                    Shop Now
                    <ArrowRight size={17} />
                </button>
                </div>

                {/* Countdown */}
                <div className="flex flex-col items-center">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-indigo-100">
                    <Clock size={17} />
                    <span>Offer Ends In</span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
                    <span className="text-xl font-bold sm:text-2xl">
                        02
                    </span>
                    <span className="text-[10px] text-indigo-100 sm:text-xs">
                        Days
                    </span>
                    </div>

                    <span className="text-xl font-bold">:</span>

                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
                    <span className="text-xl font-bold sm:text-2xl">
                        18
                    </span>
                    <span className="text-[10px] text-indigo-100 sm:text-xs">
                        Hours
                    </span>
                    </div>

                    <span className="text-xl font-bold">:</span>

                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
                    <span className="text-xl font-bold sm:text-2xl">
                        45
                    </span>
                    <span className="text-[10px] text-indigo-100 sm:text-xs">
                        Minutes
                    </span>
                    </div>

                    <span className="text-xl font-bold">:</span>

                    <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
                    <span className="text-xl font-bold sm:text-2xl">
                        30
                    </span>
                    <span className="text-[10px] text-indigo-100 sm:text-xs">
                        Seconds
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}

export default OfferBanner;