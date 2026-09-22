import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
} from "lucide-react";

const features = [
  {
    id: "security",
    icon: ShieldCheck,
    titleKey: "whyUs.features.security.title",
    descKey: "whyUs.features.security.desc",
  },
  {
    id: "delivery",
    icon: Truck,
    titleKey: "whyUs.features.delivery.title",
    descKey: "whyUs.features.delivery.desc",
  },
  {
    id: "support",
    icon: Headphones,
    titleKey: "whyUs.features.support.title",
    descKey: "whyUs.features.support.desc",
  },
  {
    id: "returns",
    icon: RotateCcw,
    titleKey: "whyUs.features.returns.title",
    descKey: "whyUs.features.returns.desc",
  },
];

function WhyShopWithUs() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#5046E5]">
            {t("whyUs.tag")}
          </p>

          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
            {t("whyUs.title")}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            {t("whyUs.subtitle")}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800/50 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-blue-600/90 dark:hover:border-blue-600/90 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg dark:hover:shadow-indigo-950/20"
              >
                {/* Icon */}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2FF] dark:bg-blue-600/10 text-blue-600 dark:text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100">
                  {t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {t(feature.descKey)}
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