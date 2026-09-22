import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { login } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast"; // 1. استيراد الـ toast
import LanguageSwitcher from "../ui/LanguageSwitcher";
import ThemeToggle from "../ui/ThemeToggle";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Logged in successfully:", response.data);

      const token =
        response.data.token ||
        response.data.accessToken ||
        response.data.data?.token;

      const user = response.data.user || response.data.data?.user;

      if (token) {
        // Save to cookies as backup
        Cookies.set("store_token", token, { expires: 7 });
        if (user) {
          Cookies.set("store_user", JSON.stringify(user), { expires: 7 });
        }

        loginUser(token, user);
        
        // 2. رسالة نجاح احترافية قبل التوجيه
        toast.success("Welcome back! Logged in successfully.");
        
        navigate("/");
      } else {
        toast.error("Login succeeded but no token received.");
      }
    } catch (err) {
      // 3. رسالة خطأ احترافية لو البيانات غلط أو فيه مشكلة بالسيرفر
      toast.error(
        err.response?.data?.message || t("auth.invalidCredentials") || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans relative">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Each small badge floats on its own path/timing so the group never moves in sync */
        @keyframes floatA {
          0%, 100% { transform: translateY(0) translateX(0); box-shadow: 0 6px 12px -4px rgba(43, 100, 246, 0.22); }
          50% { transform: translateY(-7px) translateX(1px); box-shadow: 0 18px 24px -8px rgba(43, 100, 246, 0.38); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) translateX(0); box-shadow: 0 6px 12px -4px rgba(99, 102, 241, 0.20); }
          50% { transform: translateY(-5px) translateX(-2px); box-shadow: 0 14px 20px -8px rgba(99, 102, 241, 0.34); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0); box-shadow: 0 5px 10px -4px rgba(43, 100, 246, 0.18); }
          50% { transform: translateY(-4px); box-shadow: 0 12px 18px -6px rgba(43, 100, 246, 0.30); }
        }
        @keyframes floatD {
          0%, 100% { transform: translateY(0); box-shadow: 0 5px 10px -4px rgba(30, 142, 62, 0.18); }
          50% { transform: translateY(-6px); box-shadow: 0 15px 20px -7px rgba(30, 142, 62, 0.32); }
        }

        .anim-in {
          opacity: 0;
          animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-delay-1 { animation-delay: 0.05s; }
        .anim-delay-2 { animation-delay: 0.15s; }
        .anim-delay-3 { animation-delay: 0.25s; }
        .anim-delay-4 { animation-delay: 0.35s; }
        .anim-delay-5 { animation-delay: 0.45s; }
        .anim-delay-6 { animation-delay: 0.55s; }

        .float-a { animation: floatA 4.8s cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: 0.1s; }
        .float-b { animation: floatB 5.6s cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: 0.8s; }
        .float-c { animation: floatC 4.2s cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: 1.4s; }
        .float-d { animation: floatD 5.1s cubic-bezier(0.45, 0, 0.55, 1) infinite; animation-delay: 0.4s; }

        .blink-dot {
          animation: blinkDot 1.4s ease-in-out infinite;
        }
        .spin-smooth {
          animation: spin 0.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .moment-highlight {
          color: #2b64f6;
          text-shadow: 0 5px 18px rgba(43, 100, 246, 0.22);
        }

        .dark .moment-highlight {
          color: #818cf8;
          text-shadow: 0 5px 18px rgba(129, 140, 248, 0.28);
        }

        .btn-primary {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.2s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(43, 100, 246, 0.45);
        }
        .btn-primary:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }
        .btn-primary svg {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary:hover:not(:disabled) svg {
          transform: translateX(4px);
        }
        [dir="rtl"] .btn-primary:hover:not(:disabled) svg {
          transform: translateX(-4px);
        }

        .input-field {
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
        }

        .social-btn {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.2s ease, background-color 0.2s ease,
                      box-shadow 0.2s ease;
        }
        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px -8px rgba(15, 23, 42, 0.15);
        }
        .social-btn:active {
          transform: translateY(0) scale(0.97);
        }

        .badge-hover {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }
        .badge-hover:hover {
          transform: translateY(-2px) scale(1.03) !important;
        }

        .logo-hover {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-hover:hover {
          transform: scale(1.05);
        }

        .hero-img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-img:hover {
          transform: scale(1.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-in, .float-a, .float-b, .float-c, .float-d, .blink-dot, .spin-smooth {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .btn-primary, .social-btn, .badge-hover, .logo-hover, .hero-img, .input-field {
            transition: none !important;
          }
        }
      `}</style>

      <div className="anim-in w-full max-w-[1180px] flex justify-end pb-3 gap-2">
        <ThemeToggle />
        <LanguageSwitcher className="ml-2" />
      </div>

      {/* Container */}
      <div className="w-full max-w-[1180px] bg-[#dbe5ff] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[32px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl relative">
        {/* ================ Left Side ================= */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between relative bg-[#dde6fe] dark:bg-slate-900/80 border-transparent dark:border-slate-800">
          <div>
            {/* Logo */}
            <Link
              to="/"
              className="anim-in anim-delay-1 logo-hover inline-flex items-center gap-2.5 mb-8"
            >
              <img
                src={STORE_LOGO_URL}
                alt="AllInOne"
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-black dark:text-slate-100">
                AllIn<span className="text-[#2b64f6] dark:text-indigo-400">One</span>
              </span>
            </Link>

            <h1 className="anim-in anim-delay-2 text-3xl md:text-[2.6rem] font-bold text-[#10245A] dark:text-slate-100 mb-3 leading-[1.15] tracking-tight">
              {t("auth.brandTitle1")}
              <br />
              <span className="moment-highlight">
                {t("auth.brandTitle2")}
              </span>
            </h1>
            <p className="anim-in anim-delay-3 text-[#6b7280] dark:text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              {t("auth.brandSubtitle")}
            </p>
          </div>

          <div className="anim-in anim-delay-4 relative flex justify-center items-center my-6 py-2">
            <div className="badge-hover float-a absolute left-0 rtl:left-auto rtl:right-0 top-0 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white dark:border-slate-700 flex items-center gap-1.5">
              <span className="text-xs">🎧</span>
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC] dark:text-indigo-400">
                {t("auth.badgeMusic")}
              </span>
            </div>

            <img
              src="/Rounded Pedestal & Headphones.svg"
              alt="Headphones with Pedestal"
              className="hero-img w-[300px] h-auto object-cover block"
            />

            <div className="badge-hover float-b absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white dark:border-slate-700">
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC] dark:text-indigo-400">
                {t("auth.badgeWay")}
              </span>
            </div>
          </div>

          <div className="anim-in anim-delay-5 flex items-center justify-between w-full pt-2">
            <div className="badge-hover float-c bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white dark:border-slate-700">
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

            <div className="badge-hover float-d bg-[#e6f4ea] dark:bg-emerald-950/50 px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/60">
              <span className="blink-dot inline-flex rounded-full w-2 h-2 bg-[#1e8e3e] dark:bg-emerald-400"></span>
              <span className="text-[11px] font-bold text-[#1e8e3e] dark:text-emerald-400">
                {t("auth.badgeInStock")}
              </span>
            </div>
          </div>
        </div>

        {/* ================= Right Side ================= */}
        <div className="lg:col-span-6 py-12 px-8 md:px-12 flex flex-col justify-center bg-white dark:bg-slate-900 rounded-t-[32px] lg:rounded-t-none lg:rounded-l-[32px] rtl:lg:rounded-l-none rtl:lg:rounded-r-[32px] shadow-2xl relative z-30">
          <div className="max-w-[460px] w-full mx-auto">
            <h2 className="anim-in anim-delay-2 text-4xl md:text-5xl font-bold text-[#10245A] dark:text-slate-100 mb-3 tracking-tight">
              {t("auth.loginTitle")}
            </h2>
            <p className="anim-in anim-delay-3 text-base text-[#64748b] dark:text-slate-400 mb-6 font-medium">
              {t("auth.loginSubtitle")}
            </p>

            <form onSubmit={handleSubmit} className="anim-in anim-delay-4 space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#334155] dark:text-slate-300 mb-2">
                  {t("auth.emailLabel")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("auth.emailPlaceholder")}
                  required
                  className="input-field w-full px-5 py-3.5 rounded-2xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-base text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#334155] dark:text-slate-300 mb-2">
                  {t("auth.passwordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t("auth.passwordPlaceholder")}
                    required
                    className="input-field w-full px-5 py-3.5 rounded-2xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-base text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 pr-12 rtl:pr-5 rtl:pl-12 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400 hover:text-[#475569] dark:hover:text-slate-200 transition-colors duration-200 p-1 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    <svg
                      className="w-5 h-5"
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

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#cbd5e1] dark:border-slate-700 bg-transparent text-[#2b64f6] dark:text-indigo-500 focus:ring-[#2b64f6] cursor-pointer"
                  />
                  <span className="text-sm text-[#64748b] dark:text-slate-400 font-semibold">
                    {t("auth.rememberMe")}
                  </span>
                </label>

                <Link
                  to="/forgot"
                  className="text-sm font-bold text-[#2b64f6] dark:text-indigo-400 hover:underline"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 px-6 bg-[#2b64f6] dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 dark:shadow-indigo-600/30 flex items-center justify-center gap-2.5 text-base mt-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="spin-smooth w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>{t("auth.signingIn")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("auth.loginButton")}</span>
                    <svg
                      className="w-5 h-5 rtl:rotate-180"
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
                  </>
                )}
              </button>
            </form>

            <div className="anim-in anim-delay-5 relative my-6 flex items-center justify-center">
              <div className="border-t border-[#e2e8f0] dark:border-slate-800 w-full"></div>
              <span className="bg-white dark:bg-slate-900 px-4 text-xs text-[#94a3b8] dark:text-slate-500 absolute font-semibold uppercase tracking-wider">
                {t("auth.orContinueWith")}
              </span>
            </div>

            <div className="anim-in anim-delay-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="social-btn flex items-center justify-center gap-2.5 py-3.5 px-4 border-2 border-[#e2e8f0] dark:border-slate-700 dark:bg-slate-800/80 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-bold text-[#334155] dark:text-slate-200 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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

              <button
                type="button"
                className="social-btn flex items-center justify-center gap-2.5 py-3.5 px-4 border-2 border-[#e2e8f0] dark:border-slate-700 dark:bg-slate-800/80 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-sm font-bold text-[#334155] dark:text-slate-200 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.45-.62.72-1.16 1.88-1.01 3 1.08.08 2.18-.53 2.85-1.35z" />
                </svg>
                <span>{t("auth.apple")}</span>
              </button>
            </div>

            <p className="anim-in anim-delay-6 text-center text-sm text-[#94a3b8] dark:text-slate-400 mt-8 font-medium">
              {t("auth.noAccount")}{" "}
              <Link
                to="/signup"
                className="text-[#2b64f6] dark:text-indigo-400 font-bold hover:underline"
              >
                {t("auth.createAccountLink")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}