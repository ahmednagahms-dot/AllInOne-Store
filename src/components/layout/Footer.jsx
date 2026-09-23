import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, CreditCard } from "lucide-react";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-900 dark:bg-slate-900 text-white border-t border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6 lg:py-14">
        {/* Main */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src={STORE_LOGO_URL}
                alt="AllInOne"
                className="h-10 w-auto bg-white p-1 rounded-lg  object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                AllIn<span className="text-primary-500">One</span>
              </span>
            </Link>

            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-slate-400">
              {t("footer.desc")}
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { className: "fa-brands fa-youtube", href: "#", label: "YouTube" },
                { className: "fa-brands fa-facebook", href: "#", label: "Facebook" },
                { className: "fa-brands fa-x-twitter", href: "#", label: "X" },
                { className: "fa-brands fa-linkedin-in", href: "#", label: "LinkedIn" },
              ].map(({ className, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-white transition duration-200 hover:-translate-y-1 hover:border-primary-500 hover:bg-primary-500 hover:text-white hover:shadow-[0_0_18px_rgba(79,70,229,0.45)]"
                >
                  <i className={`${className} text-sm`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: t("nav.home"), to: "/" },
                { label: t("nav.shop"), to: "/shop" },
                { label: t("nav.orders"), to: "/orders" },
                { label: t("nav.wishlist"), to: "/wishlist" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.customerCare")}
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                t("footer.contactUs"),
                t("footer.trackOrder"),
                t("footer.shipping"),
                t("footer.returns"),
                t("footer.faqs"),
              ].map((item) => (
                <li key={item}>
                  <span className="cursor-pointer text-sm text-slate-400 transition hover:text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              {t("footer.legal")}
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                t("footer.privacy"),
                t("footer.terms"),
                t("footer.cookie"),
                t("footer.accessibility"),
              ].map((item) => (
                <li key={item}>
                  <span className="cursor-pointer text-sm text-slate-400 transition hover:text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-9 h-px w-full bg-slate-800" />

        {/* Bottom */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AllInOne. {t("footer.rights")}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard size={16} strokeWidth={1.7} />
              <span className="text-sm">{t("footer.securePayment")}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} strokeWidth={1.7} />
              <span className="text-sm">{t("footer.secureShopping")}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {["VISA", "MC", "AMEX"].map((method) => (
                <span
                  key={method}
                  className="flex h-8 min-w-[44px] items-center justify-center rounded-md bg-white dark:bg-slate-800 px-2 text-[10px] font-bold text-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}