import {
    Heart,
    ShoppingCart,
    User,
    Search,
    ClipboardList,
    ChevronDown,
    } from "lucide-react";

    const STORE_LOGO_URL =
    "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

    function Navbar() {
    return (
        <>
        {/* Top Bar */}
        <div className="w-full bg-[#0F172A] text-white">
            <div className="mx-auto flex min-h-9 max-w-[1200px] items-center justify-between gap-4 px-5 text-xs sm:px-6 sm:text-sm">
            {/* Shipping */}
            <p className="hidden sm:block">
                Free shipping on orders over $50
            </p>

            <p className="sm:hidden">
                Free shipping over $50
            </p>

            {/* Top Right */}
            <div className="ml-auto flex items-center gap-4">
                <button
                type="button"
                className="flex items-center gap-1 transition hover:text-indigo-300"
                >
                English
                <ChevronDown size={13} />
                </button>

                <span className="h-4 w-px bg-slate-600" />

                <button
                type="button"
                className="flex items-center gap-1 transition hover:text-indigo-300"
                >
                USD
                <ChevronDown size={13} />
                </button>
            </div>
            </div>
        </div>

        {/* Main Navbar */}
        <header className="w-full border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-20 max-w-[1200px] items-center gap-5 px-5 sm:px-6">
            {/* Logo */}
            <a
                href="/"
                className="flex shrink-0 items-center gap-2"
            >
                <img
                src={STORE_LOGO_URL}
                alt="AllInOne"
                className="h-10 w-10 object-contain"
                />

                <span className="text-xl font-bold tracking-tight text-[#0F172A]">
                All<span className="text-[#5046E5]">InOne</span>
                </span>
            </a>

            {/* Navigation */}
            <nav className="hidden items-center gap-6 lg:flex">
                <a
                href="/"
                className="text-sm font-semibold text-[#5046E5]"
                >
                Home
                </a>

                <a
                href="#shop"
                className="text-sm font-medium text-slate-600 transition hover:text-[#5046E5]"
                >
                Shop
                </a>

                <a
                href="#orders"
                className="text-sm font-medium text-slate-600 transition hover:text-[#5046E5]"
                >
                My Orders
                </a>

                <a
                href="#wishlist"
                className="text-sm font-medium text-slate-600 transition hover:text-[#5046E5]"
                >
                Wishlist
                </a>
            </nav>

            {/* Search */}
            <div className="ml-auto hidden max-w-[280px] flex-1 md:block">
                <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type="text"
                    placeholder="Search products..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#5046E5] focus:bg-white"
                />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Wishlist */}
                <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-[#EEF2FF] hover:text-[#5046E5]"
                aria-label="Wishlist"
                >
                <Heart size={20} />
                </button>

                {/* Cart */}
                <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-[#EEF2FF] hover:text-[#5046E5]"
                aria-label="Shopping Cart"
                >
                <ShoppingCart size={20} />

                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5046E5] px-1 text-[9px] font-bold text-white">
                    0
                </span>
                </button>

                {/* User */}
                <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF] text-[#5046E5] transition hover:bg-[#5046E5] hover:text-white"
                aria-label="Account"
                >
                <User size={19} />
                </button>

                {/* Welcome + Account */}
                <div className="hidden min-w-24 sm:block">
                <p className="text-[11px] text-slate-400">
                    Welcome
                </p>

                <button
                    type="button"
                    className="flex items-center gap-1 text-sm font-semibold text-[#0F172A] transition hover:text-[#5046E5]"
                >
                    Sign In / Register
                    <ChevronDown size={13} />
                </button>
                </div>
            </div>
            </div>

            {/* Mobile Search */}
            <div className="border-t border-slate-100 px-5 py-3 md:hidden">
            <div className="relative">
                <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                type="text"
                placeholder="Search products..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#5046E5]"
                />
            </div>
            </div>
        </header>
        </>
    );
}

export default Navbar;