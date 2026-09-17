import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    ShieldCheck,
    CreditCard,
    } from "lucide-react";

    const STORE_LOGO_URL =
    "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

    function BrandLogo() {
    return (
        <a href="/" className="inline-flex items-center gap-2">
        <img
            src={STORE_LOGO_URL}
            alt="ShopEase"
            className="h-[38px] w-auto object-contain"
        />

        <span className="whitespace-nowrap text-[19px] font-bold tracking-[-0.5px] text-white">
            AllIn<span className="text-[#5046E5]">One</span>
        </span>
        </a>
    );
    }

    function Footer() {
    return (
        <footer className="w-full bg-[#0F172A] font-['Inter',Arial,sans-serif] text-white">
        <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-6 lg:py-14">
            {/* Main Footer */}
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
            {/* Brand */}
            <div>
                <BrandLogo />

                <p className="mt-5 max-w-[300px] text-[13px] leading-6 text-[#B8C4D9]">
                Your one-stop destination for the latest technology,
                premium products, and everything you need to upgrade
                your everyday lifestyle.
                </p>

                {/* Social Icons */}
                <div className="mt-6 flex items-center gap-2.5">
                <a
                    href="#"
                    aria-label="Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24324A] bg-[#17243A] text-[#C8D3E5] transition hover:border-[#5046E5] hover:bg-[#5046E5] hover:text-white"
                >
                    <Facebook size={14} />
                </a>

                <a
                    href="#"
                    aria-label="Instagram"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24324A] bg-[#17243A] text-[#C8D3E5] transition hover:border-[#5046E5] hover:bg-[#5046E5] hover:text-white"
                >
                    <Instagram size={14} />
                </a>

                <a
                    href="#"
                    aria-label="Twitter"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24324A] bg-[#17243A] text-[#C8D3E5] transition hover:border-[#5046E5] hover:bg-[#5046E5] hover:text-white"
                >
                    <Twitter size={14} />
                </a>

                <a
                    href="#"
                    aria-label="Youtube"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#24324A] bg-[#17243A] text-[#C8D3E5] transition hover:border-[#5046E5] hover:bg-[#5046E5] hover:text-white"
                >
                    <Youtube size={14} />
                </a>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h3 className="text-[14px] font-bold text-white">
                Quick Links
                </h3>

                <ul className="footer-links mt-5 space-y-3">
                <li>
                    <a
                    href="/"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Home
                    </a>
                </li>

                <li>
                    <a
                    href="#shop"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Shop
                    </a>
                </li>

                <li>
                    <a
                    href="#orders"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    My Orders
                    </a>
                </li>

                <li>
                    <a
                    href="#wishlist"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Wishlist
                    </a>
                </li>
                </ul>
            </div>

            {/* Customer Care */}
            <div>
                <h3 className="text-[14px] font-bold text-white">
                Customer Care
                </h3>

                <ul className="footer-links mt-5 space-y-3">
                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Contact Us
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Track Order
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Shipping & Delivery
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Returns & Refunds
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    FAQs
                    </a>
                </li>
                </ul>
            </div>

            {/* Legal */}
            <div>
                <h3 className="text-[14px] font-bold text-white">
                Legal
                </h3>

                <ul className="footer-links mt-5 space-y-3">
                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Privacy Policy
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Terms & Conditions
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Cookie Policy
                    </a>
                </li>

                <li>
                    <a
                    href="#"
                    className="text-[10px] text-[#B8C4D9] transition hover:text-white"
                    >
                    Accessibility
                    </a>
                </li>
                </ul>
            </div>
            </div>

            {/* Divider */}
            <div className="my-9 h-px w-full bg-[#1E293B]" />

            {/* Bottom Footer */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[12px] text-[#98A8C2]">
                © 2026 AllInOne. All rights reserved.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                {/* Secure Payment */}
                <div className="flex items-center gap-2 text-[#AEBBD0]">
                <CreditCard size={15} strokeWidth={1.7} />

                <span className="text-[12px]">
                    Secure Payment
                </span>
                </div>

                {/* Security */}
                <div className="flex items-center gap-2 text-[#AEBBD0]">
                <ShieldCheck size={15} strokeWidth={1.7} />

                <span className="text-[12px]">
                    100% Secure Shopping
                </span>
                </div>

                {/* Payment Methods */}
                <div className="flex items-center gap-1.5">
                <span className="flex h-8 min-w-[42px] items-center justify-center rounded bg-white px-2 text-[9px] font-bold text-[#172B4D]">
                    VISA
                </span>

                <span className="flex h-8 min-w-[42px] items-center justify-center rounded bg-white px-2 text-[9px] font-bold text-[#172B4D]">
                    MC
                </span>

                <span className="flex h-8 min-w-[42px] items-center justify-center rounded bg-white px-2 text-[9px] font-bold text-[#172B4D]">
                    AMEX
                </span>
                </div>
            </div>
            </div>
        </div>
        </footer>
    );
}

export default Footer;