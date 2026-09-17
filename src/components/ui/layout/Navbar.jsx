import { useState } from "react";
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    } from "lucide-react";

    const STORE_LOGO_URL =
    "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

    function BrandLogo() {
    return (
        <a href="/" className="flex shrink-0 items-center gap-2">
        <img
            src={STORE_LOGO_URL}
            alt="ShopEase"
            className="h-[34px] w-auto object-contain"
        />
        <span className="whitespace-nowrap text-[18px] font-bold tracking-[-0.4px] text-[#10265B]">
            AllIn<span className="text-[#5046E5]">One</span>
        </span>
        </a>
    );
    }

    function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        // تنفيذ التوجيه لصفحة البحث، مثال: router.push(`/search?q=${searchQuery}`)
    };

    return (
        <header className="w-full bg-white font-['Inter',Arial,sans-serif]">
        {/* Top Shipping Bar */}
        <div className="bg-[#071B49] text-white">
            <div className="mx-auto flex h-[28px] max-w-[1200px] items-center justify-between px-4 sm:px-5">
            <span className="text-[9px] font-normal tracking-[0.01em]">
                Free shipping on orders over $50
            </span>

            <div className="hidden items-center gap-5 sm:flex">
                <button className="text-[9px] font-normal hover:text-[#D8E6FF]">
                Track Order
                </button>

                <button className="text-[9px] font-normal hover:text-[#D8E6FF]">
                Help
                </button>

                <button className="flex items-center gap-1 text-[9px] font-normal hover:text-[#D8E6FF]">
                EN
                <ChevronDown size={9} strokeWidth={1.8} />
                </button>
            </div>
            </div>
        </div>

        {/* Main Navbar */}
        <nav
            className="border-b border-[#E5E7EB] bg-white"
            style={{ backgroundColor: "#FFFFFF" }}
        >
            <div className="mx-auto flex min-h-[70px] max-w-[1200px] items-center justify-between gap-5 px-5 sm:px-6 lg:min-h-[76px]">
            {/* Logo */}
            <BrandLogo />

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-7 lg:flex">
                <a
                href="/"
                className="text-[13px] font-semibold text-[#1554E8] transition hover:text-[#5046E5]"
                >
                Home
                </a>
                <a
                href="#shop"
                className="text-[13px] font-medium text-[#667085] transition hover:text-[#1554E8]"
                >
                Shop
                </a>
                <a
                href="#orders"
                className="text-[13px] font-medium text-[#667085] transition hover:text-[#1554E8]"
                >
                My Orders
                </a>
                <a
                href="#wishlist"
                className="text-[13px] font-medium text-[#667085] transition hover:text-[#1554E8]"
                >
                Wishlist
                </a>
            </div>

            {/* Desktop Search */}
            <form
                onSubmit={handleSearchSubmit}
                className="hidden min-w-0 flex-1 lg:block lg:max-w-[260px] xl:max-w-[300px]"
            >
                <div
                    className="relative flex h-[40px] items-center rounded-full border-0 bg-white"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}
                >
                <Search
                    size={15}
                    strokeWidth={1.8}
                    className="absolute left-3 z-10 text-[#000000]"
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="navbar-search-input navbar-search-input-bordered min-w-0 flex-1 bg-transparent pl-9 pr-3 text-[13px] text-[#000000] placeholder:text-[#000000] outline-none caret-black focus:ring-0"
                    style={{ color: "#000000", caretColor: "#000000", paddingLeft: "2rem" }}
                />
                </div>
            </form>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-4 lg:flex">
                {/* Wishlist */}
                <a
                href="#wishlist"
                className="relative flex h-10 w-10 items-center justify-center text-[#667085] transition hover:text-[#1554E8]"
                aria-label="Wishlist"
                >
                <Heart size={22} strokeWidth={1.8} />
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#1554E8] text-[9px] font-bold text-white">
                    2
                </span>
                </a>

                {/* Cart */}
                <a
                href="#cart"
                className="relative flex h-10 w-10 items-center justify-center text-[#667085] transition hover:text-[#1554E8]"
                aria-label="Shopping cart"
                >
                <ShoppingCart size={22} strokeWidth={1.8} />
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#1554E8] text-[9px] font-bold text-white">
                    3
                </span>
                </a>

                {/* User */}
                <a
                href="/login"
                className="flex items-center gap-2 border-l border-[#E5E7EB] pl-4"
                >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EEF9] text-[#1554E8]">
                    <User size={16} strokeWidth={1.8} />
                </div>
                <div className="hidden xl:block">
                    <p className="text-[11px] font-semibold text-[#10265B]">
                    Welcome
                    </p>
                    <p className="text-[10px] text-[#98A2B3]">My Account</p>
                </div>
                </a>
            </div>

            {/* Mobile Menu Button */}
            <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#10265B] hover:bg-[#F8FAFC] lg:hidden"
                aria-label="Toggle menu"
            >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
            <div className="border-t border-[#E5E7EB] bg-white px-5 py-4 lg:hidden">
                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="mb-4">
                <div
                    className="relative flex h-[44px] items-center rounded-full border-0 bg-white"
                    style={{ backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" }}
                >
                    <Search
                    size={16}
                    strokeWidth={1.8}
                    className="absolute left-3 z-10 text-[#000000]"
                    />
                    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="navbar-search-input navbar-search-input-bordered min-w-0 flex-1 bg-transparent pl-10 pr-3 text-[14px] text-[#000000] placeholder:text-[#000000] outline-none caret-black focus:ring-0"
                    style={{ color: "#000000", caretColor: "#000000", paddingLeft: "3.25rem" }}
                    />
                </div>
                </form>

                {/* Mobile Links */}
                <div className="flex flex-col">
                <a
                    href="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-[#F0F2F5] py-3 text-[14px] font-semibold text-[#1554E8]"
                >
                    Home
                </a>
                <a
                    href="#shop"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-[#F0F2F5] py-3 text-[14px] font-medium text-[#667085]"
                >
                    Shop
                </a>
                <a
                    href="#orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-[#F0F2F5] py-3 text-[14px] font-medium text-[#667085]"
                >
                    My Orders
                </a>
                <a
                    href="#wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="border-b border-[#F0F2F5] py-3 text-[14px] font-medium text-[#667085]"
                >
                    Wishlist
                </a>
                <a
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-[14px] font-medium text-[#667085]"
                >
                    <User size={16} />
                    My Account
                </a>
                </div>
            </div>
            )}
        </nav>
        </header>
    );
    }

export default Navbar;    