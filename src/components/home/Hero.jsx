    import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    ShieldCheck,
    Truck,
    } from "lucide-react";

    function Hero() {
    return (
        <section className="w-full overflow-hidden bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-5 md:py-8 lg:py-10">
            <div className="relative overflow-hidden rounded-2xl bg-[#EAF2FF]">
            {/* Main Hero Content */}
            <div className="grid min-h-[420px] grid-cols-1 items-center lg:grid-cols-2">
                {/* Left Content */}
                <div className="relative z-10 px-6 py-10 sm:px-10 md:px-14 lg:px-12 lg:py-12 xl:px-16">
                {/* Small Label */}
                <div className="mb-4 inline-flex items-center rounded-full bg-[#D9E7FF] px-3 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1554E8]">
                    New Arrival
                    </span>
                </div>

                {/* Heading */}
                <h1 className="max-w-[560px] text-3xl font-extrabold leading-[1.08] tracking-tight text-[#10265B] sm:text-4xl md:text-[46px] lg:text-[42px] xl:text-[48px]">
                    Upgrade Your Style
                    <br />
                    with the Latest Tech
                </h1>

                {/* Description */}
                <p className="mt-5 max-w-[500px] text-sm leading-6 text-slate-500 sm:text-[15px]">
                    Discover the latest technology and premium products designed
                    to make your everyday life smarter, easier, and more stylish.
                </p>

                {/* Buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1554E8] px-6 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0D47D9]">
                    Shop Now
                    <ArrowRight size={15} strokeWidth={2.2} />
                    </button>

                    <button className="inline-flex h-11 items-center justify-center rounded-lg border border-[#1554E8] bg-white px-6 text-xs font-semibold text-[#1554E8] transition hover:bg-[#F3F7FF]">
                    Explore Collections
                    </button>
                </div>

                {/* Benefits */}
                <div className="mt-8 grid max-w-[560px] grid-cols-1 gap-4 border-t border-[#D7E4F7] pt-6 sm:grid-cols-3 sm:gap-3">
                    <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1554E8]">
                        <ShieldCheck size={16} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[#10265B]">
                        Premium Quality
                        </p>
                        <p className="mt-0.5 text-[8px] text-slate-400">
                        Trusted products
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1554E8]">
                        <Truck size={16} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[#10265B]">
                        Fast Delivery
                        </p>
                        <p className="mt-0.5 text-[8px] text-slate-400">
                        Quick & reliable
                        </p>
                    </div>
                    </div>

                    <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#1554E8]">
                        <RotateCcw size={16} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold text-[#10265B]">
                        Easy Returns
                        </p>
                        <p className="mt-0.5 text-[8px] text-slate-400">
                        Hassle-free returns
                        </p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Right Product Area */}
                <div className="relative flex min-h-[330px] items-center justify-center px-8 pb-10 pt-4 sm:min-h-[360px] lg:min-h-[420px] lg:px-6 lg:pb-0 lg:pt-0">
                {/* Decorative Circle */}
                <div className="absolute right-[5%] top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-white/70 sm:h-[330px] sm:w-[330px] lg:h-[370px] lg:w-[370px]" />

                {/* Product Placeholder */}
                <div className="relative z-10 flex h-[250px] w-[250px] items-center justify-center rounded-full bg-gradient-to-br from-white to-[#DDEAFF] shadow-[0_20px_50px_rgba(21,84,232,0.12)] sm:h-[290px] sm:w-[290px] lg:h-[320px] lg:w-[320px]">
                    <div className="text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-[#10265B] shadow-xl sm:h-28 sm:w-28">
                        <span className="text-4xl">⌚</span>
                    </div>

                    <p className="text-xs font-semibold text-[#10265B]">
                        Latest Tech
                    </p>

                    <p className="mt-1 text-[9px] text-slate-400">
                        Premium Collection
                    </p>
                    </div>
                </div>

                {/* Discount Badge */}
                <div className="absolute right-[8%] top-[8%] z-20 flex h-16 w-16 rotate-6 items-center justify-center rounded-full bg-[#1554E8] text-center text-white shadow-lg sm:h-[72px] sm:w-[72px]">
                    <div>
                    <p className="text-lg font-extrabold leading-none">40%</p>
                    <p className="mt-0.5 text-[8px] font-semibold uppercase">
                        Off
                    </p>
                    </div>
                </div>
                </div>
            </div>

            {/* Slider Arrows */}
            <button
                type="button"
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-30 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#10265B] shadow-md transition hover:bg-[#1554E8] hover:text-white sm:flex"
            >
                <ChevronLeft size={16} />
            </button>

            <button
                type="button"
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-30 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#10265B] shadow-md transition hover:bg-[#1554E8] hover:text-white sm:flex"
            >
                <ChevronRight size={16} />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-[#1554E8]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            </div>
            </div>
        </div>
        </section>
    );
    }

    export default Hero;