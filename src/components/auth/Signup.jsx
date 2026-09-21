import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendRegisterOtp } from "../../api/auth.api";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import ThemeToggle from "../ui/ThemeToggle";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isStrongPassword = formData.password.length >= 6;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }

    try {
      setLoading(true);

      // API expects username, not name
      const username =
        `${formData.firstName}${formData.lastName}`
          .toLowerCase()
          .replace(/\s+/g, "") || formData.email.split("@")[0];

      const response = await sendRegisterOtp({
        username,
        email: formData.email,
        password: formData.password,
      });

      console.log("OTP sent:", response.data);

      // After OTP sent successfully → go to verify page
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          type: "register",
        },
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        t("auth.registerError");
      setError(message);
    } finally {
      setLoading(false);
    }
  };
   const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 font-sans relative">
      {/* Top Bar with Language Switcher */}
      <div className="w-full max-w-[1220px] flex justify-end pb-3 gap-2">
        <ThemeToggle />
        <LanguageSwitcher className="ml-2" />
      </div>

      {/* ================= Container ================= */}
      <div className="w-full max-w-[1220px] bg-[#dbe5ff] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[32px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl relative">
        {/* ================= Left Side ================= */}
        <div className="lg:col-span-6 p-8 md:p-11 flex flex-col justify-between relative bg-[#dde6fe] dark:bg-slate-900/80 border-b lg:border-b-0 lg:border-r rtl:lg:border-r-0 rtl:lg:border-l dark:border-slate-800">
          <div>
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

            <Link to="/" className="inline-flex items-center gap-2.5 text-[#2b64f6] dark:text-indigo-400 font-bold text-lg mb-6">
              <span className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-base">
                🛍️
              </span>
              <span className="text-[#0038DC] dark:text-indigo-400 font-bold text-xl tracking-tight">
                ShopEase
              </span>
            </Link>


            <h1 className="text-3xl md:text-[2.5rem] font-bold text-[#10245A] dark:text-slate-100 mb-3 leading-[1.15] tracking-tight">
              {t("auth.brandTitle1")}
              <br />
              {t("auth.brandTitle2")}
            </h1>

            <p className="text-[#6b7280] dark:text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              {t("auth.brandSubtitle")}
            </p>
          </div>

          {/* Image Section */}
          <div className="relative flex justify-center items-center my-5">
            {/* YOUR MUSIC */}
            <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 z-20 bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white dark:border-slate-700 flex items-center gap-1.5">
              <span className="text-xs">🎧</span>
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC] dark:text-indigo-400">
                {t("auth.badgeMusic")}
              </span>
            </div>

            {/* Image */}
            <img
              src="/Rounded Pedestal & Headphones.svg"
              alt="Headphones with Pedestal"
              className="w-[280px] md:w-[300px] h-auto object-cover block"
            />

            {/* OUR WAY */}
            <div className="absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white dark:border-slate-700">
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC] dark:text-indigo-400">
                {t("auth.badgeWay")}
              </span>
            </div>
          </div>

          {/* Bottom Badges */}
          <div className="flex items-center justify-between w-full pt-2">
            <div className="bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white dark:border-slate-700">
              <svg
                className="w-3.5 h-3.5 text-[#2b64f6] dark:text-indigo-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-[11px] font-bold text-[#0038DC] dark:text-indigo-400">
                {t("auth.badgeAudio")}
              </span>
            </div>

            <div className="bg-[#e6f4ea] dark:bg-emerald-950/50 px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e] dark:bg-emerald-400"></span>
              <span className="text-[11px] font-bold text-[#1e8e3e] dark:text-emerald-400">
                {t("auth.badgeInStock")}
              </span>
            </div>
          </div>
        </div>

        {/* ================= Right Side ================= */}
        <div className="lg:col-span-6 py-9 px-8 md:px-12 flex flex-col justify-center bg-white dark:bg-slate-900 rounded-t-[32px] lg:rounded-t-none lg:rounded-l-[32px] rtl:lg:rounded-l-none rtl:lg:rounded-r-[32px] shadow-2xl relative z-30">
          <div className="max-w-[450px] w-full mx-auto">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-[2.1rem] font-bold text-[#10245A] dark:text-slate-100 mb-1 tracking-tight">
                {t("auth.registerTitle")}
              </h2>
              <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 font-medium">
                {t("auth.registerSubtitle")}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 dark:bg-rose-950/50 text-red-600 dark:text-rose-400 text-xs rounded-xl border border-red-200 dark:border-rose-900/60 font-medium">
                {error}
              </div>
            )}

            {/* ================= Form ================= */}
            <form className="space-y-3.5" onSubmit={handleSubmit}>
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                    {t("auth.firstNameLabel")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t("auth.firstNamePlaceholder")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                    {t("auth.lastNameLabel")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t("auth.lastNamePlaceholder")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                  {t("auth.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("auth.emailPlaceholder")}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                  {t("auth.phoneLabel")}
                </label>
                <div className="flex gap-2.5" dir="ltr">
                  <select className="px-3 py-3 text-xs md:text-sm border border-[#dbe5ff] dark:border-slate-700 rounded-xl bg-[#eff4ff] dark:bg-slate-800 text-[#334155] dark:text-slate-200 focus:outline-none font-semibold">
                    <option>EG +20</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("auth.phonePlaceholder")}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password + Confirm Password */}
              <div className="grid grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                    {t("auth.passwordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 pr-9 rtl:pr-4 rtl:pl-9 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400 hover:text-[#475569] dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] md:text-xs font-bold text-[#334155] dark:text-slate-300 mb-1">
                    {t("auth.confirmPasswordLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 pr-9 rtl:pr-4 rtl:pl-9 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400 hover:text-[#475569] dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                      aria-label="Toggle confirm password visibility"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && isStrongPassword && (
                <div className="flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {t("auth.passwordStrength")}
                  </span>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 rounded border-[#cbd5e1] dark:border-slate-700 bg-transparent text-[#2b64f6] dark:text-indigo-500 focus:ring-[#2b64f6] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-[#64748b] dark:text-slate-400 font-semibold"
                >
                  {t("auth.agreeTerms")}{" "}
                  <a href="#" className="text-[#2b64f6] dark:text-indigo-400 hover:underline">
                    {t("auth.terms")}
                  </a>{" "}
                  {t("auth.and")}{" "}
                  <a href="#" className="text-[#2b64f6] dark:text-indigo-400 hover:underline">
                    {t("auth.privacyPolicy")}
                  </a>
                </label>
              </div>

              {/* Create Account */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 bg-[#2b64f6] dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 dark:shadow-indigo-600/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm mt-1 disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {loading ? t("auth.sendingOtp") : t("auth.registerButton")}
                </span>
                <svg
                  className="w-4 h-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>

              {/* Divider */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="border-t border-[#e2e8f0] dark:border-slate-800 w-full"></div>
                <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-[#94a3b8] dark:text-slate-500 absolute font-semibold uppercase tracking-wider">
                  {t("auth.orContinueWith")}
                </span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-3 border border-[#e2e8f0] dark:border-slate-700 dark:bg-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-bold text-[#334155] dark:text-slate-200 active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t("auth.google")}</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-3 border border-[#e2e8f0] dark:border-slate-700 dark:bg-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-bold text-[#334155] dark:text-slate-200 active:scale-[0.98] cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 1.08.08 2.18-.53 2.85-1.35z" />
                  </svg>
                  <span>{t("auth.apple")}</span>
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-xs text-[#64748b] dark:text-slate-400 pt-1.5 font-medium">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#2b64f6] dark:text-indigo-400 hover:underline"
                >
                  {t("auth.loginLink")}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}