import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const { user, isAuthenticated, logoutUser } = useAuth();
  const { cartItemsCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `font-medium transition ${
      isActive ? "text-primary-500" : "text-gray-600 hover:text-primary-500"
    }`;
   const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary-500 text-white text-sm py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>{t("nav.freeShippingNotice")}</p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:underline">{t("nav.trackOrder")}</span>
            <span className="cursor-pointer hover:underline">{t("nav.help")}</span>
            <LanguageSwitcher className="bg-white/95 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18 gap-3">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5">
                        <img
                          src={STORE_LOGO_URL}
                          alt="AllInOne"
                          className="h-9 w-auto object-contain"
                        />
                        <span className="text-lg font-bold tracking-tight text-black">
                          AllIn<span className="text-primary-500">One</span>
                        </span>
                      </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/" className={navLinkClass} end>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              {t("nav.shop")}
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              {t("nav.orders")}
            </NavLink>
          
          </nav>

          {/* Search - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-2"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("nav.searchPlaceholder")}
                className="w-full pl-4 pr-11 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                aria-label={t("common.search")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-500 rtl:right-auto rtl:left-3"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-gray-600 hover:text-primary-500 transition"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative p-2 text-gray-600 hover:text-primary-500 transition"
            >
              <ShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartItemsCount > 9 ? "9+" : cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={isUserMenuOpen}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt={user?.username || "User"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div className="hidden xl:block text-xs">
                    <span className="text-gray-400 block font-normal">
                      {t("nav.welcome")}
                    </span>
                    <span className="font-bold text-gray-800 block">
                      {t("nav.hi")}{" "}
                      {user?.username?.split(" ")[0] ||
                        user?.name?.split(" ")[0] ||
                        t("nav.user")}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden xl:block" />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg py-2 z-50"
                  >
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-start"
                    >
                      {t("nav.profile")}
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-start"
                    >
                      {t("nav.orders")}
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-start"
                    >
                      {t("nav.wishlist")}
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-start px-4 py-2.5 text-sm text-danger hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={16} />
                      {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-500"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-sm"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {/* Mobile Language Switcher */}
            <div className="pb-3 flex justify-between items-center border-b border-gray-100">
              <span className="text-xs text-gray-500">{t("nav.freeShippingNotice")}</span>
              <LanguageSwitcher />
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="my-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("nav.searchMobilePlaceholder")}
                  className="w-full pl-4 pr-10 rtl:pr-4 rtl:pl-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  aria-label={t("common.search")}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 font-medium ${
                  isActive ? "text-primary-500" : "text-gray-700"
                }`
              }
            >
              {t("nav.home")}
            </NavLink>
            <NavLink
              to="/shop"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 font-medium ${
                  isActive ? "text-primary-500" : "text-gray-700"
                }`
              }
            >
              {t("nav.shop")}
            </NavLink>
            <NavLink
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 font-medium ${
                  isActive ? "text-primary-500" : "text-gray-700"
                }`
              }
            >
              {t("nav.orders")}
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 font-medium ${
                  isActive ? "text-primary-500" : "text-gray-700"
                }`
              }
            >
              {t("nav.wishlist")}
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block py-2.5 font-medium ${
                  isActive ? "text-primary-500" : "text-gray-700"
                }`
              }
            >
              {t("nav.orders")}
            </NavLink>

            {!isAuthenticated ? (
              <div className="pt-3 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 bg-primary-500 text-white rounded-xl font-medium"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2.5 border border-primary-500 text-primary-500 rounded-xl font-medium"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-start py-2.5 text-danger font-medium cursor-pointer"
              >
                {t("nav.logout")}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}