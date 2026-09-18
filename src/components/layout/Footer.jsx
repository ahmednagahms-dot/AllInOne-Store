import { Link } from "react-router-dom";
import { ShieldCheck, CreditCard } from "lucide-react";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6 lg:py-14">
        {/* Main */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src={STORE_LOGO_URL}
                alt="AllInOne"
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                AllIn<span className="text-primary-500">One</span>
              </span>
            </Link>

            <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-slate-400">
              Your one-stop destination for the latest technology, premium
              products, and everything you need to upgrade your lifestyle.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
              {["f", "in", "x", "yt"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 transition hover:border-primary-500 hover:bg-primary-500 hover:text-white"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "My Orders", to: "/orders" },
                { label: "Wishlist", to: "/wishlist" },
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
            <h3 className="text-sm font-semibold text-white">Customer Care</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Contact Us",
                "Track Order",
                "Shipping & Delivery",
                "Returns & Refunds",
                "FAQs",
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
            <h3 className="text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-5 space-y-3">
              {[
                "Privacy Policy",
                "Terms & Conditions",
                "Cookie Policy",
                "Accessibility",
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
            © {new Date().getFullYear()} AllInOne. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-2 text-slate-400">
              <CreditCard size={16} strokeWidth={1.7} />
              <span className="text-sm">Secure Payment</span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={16} strokeWidth={1.7} />
              <span className="text-sm">100% Secure Shopping</span>
            </div>

            <div className="flex items-center gap-1.5">
              {["VISA", "MC", "AMEX"].map((method) => (
                <span
                  key={method}
                  className="flex h-8 min-w-[44px] items-center justify-center rounded-md bg-white px-2 text-[10px] font-bold text-slate-800"
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