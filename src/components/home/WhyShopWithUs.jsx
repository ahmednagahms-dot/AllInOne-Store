import {
    ShieldCheck,
    Truck,
    Headphones,
    RotateCcw,
    } from "lucide-react";

    const features = [
    {
        id: 1,
        icon: ShieldCheck,
        title: "Secure Shopping",
        description: "Your information and payments are always protected.",
    },
    {
        id: 2,
        icon: Truck,
        title: "Fast Delivery",
        description: "Get your orders delivered quickly and safely.",
    },
    {
        id: 3,
        icon: Headphones,
        title: "24/7 Support",
        description: "Our support team is always here to help you.",
    },
    {
        id: 4,
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Simple and hassle-free returns when you need them.",
    },
    ];

    function WhyShopWithUs() {
    return (
        <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
            {/* Header */}
            <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
                Why Us
            </p>

            <h2 className="text-3xl font-bold text-[#0F172A]">
                Why Shop With Us
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                We make your shopping experience simple, safe, and enjoyable.
            </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
                const Icon = feature.icon;

                return (
                <div
                    key={feature.id}
                    className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[#5046E5] hover:bg-white hover:shadow-lg"
                >
                    {/* Icon */}
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] text-[#5046E5] transition duration-300 group-hover:bg-[#5046E5] group-hover:text-white">
                    <Icon size={25} strokeWidth={1.8} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#0F172A]">
                    {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                    </p>
                </div>
                );
            })}
            </div>
        </div>
        </section>
    );
}

export default WhyShopWithUs;