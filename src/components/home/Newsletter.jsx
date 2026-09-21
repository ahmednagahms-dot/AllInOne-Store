import { useTranslation } from "react-i18next";
import { Mail, ArrowRight } from "lucide-react";

function Newsletter() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-white dark:bg-slate-950 py-16 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#403D88] border border-transparent dark:border-slate-800 px-6 py-10 sm:px-10 lg:px-16 shadow-lg">
          {/* Decorative Circles */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#5046E5]/20" />
          <div className="absolute -bottom-20 left-20 h-40 w-40 rounded-full bg-[#5046E5]/10" />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#5046E5]">
              <Mail size={25} />
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("newsletter.title")}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              {t("newsletter.subtitle")}
            </p>

            {/* Form */}
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail
                  size={18}
                  className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  className="h-12 w-full rounded-xl border border-slate-600 dark:border-slate-700 bg-white dark:bg-slate-800 px-11 text-sm text-[#0F172A] dark:text-white outline-none transition placeholder:text-slate-400 focus:border-[#5046E5] focus:ring-2 focus:ring-[#5046E5]/20"
                />
              </div>

              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#403D88] transition dark:bg-white dark:text-[#403D88]  cursor-pointer"
              >
                {t("newsletter.button")}
                <ArrowRight size={17} className="rtl:rotate-180" />
              </button>
            </form>

            {/* Small Text */}
            <p className="mt-4 text-xs text-slate-400">
              {t("newsletter.privacy")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;