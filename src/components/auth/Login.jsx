import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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

      const user =
        response.data.user ||
        response.data.data?.user;

      if (token) {
        // يحدث الـ AuthContext فورًا → الـ Navbar بيتغير من غير Refresh
        loginUser(token, user);
        navigate("/");
      } else {
        setError("Login succeeded but no token received");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-[1180px] bg-[#dbe5ff] rounded-[32px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl relative">
        {/* ================ Left Side ================= */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between relative bg-[#dde6fe]">
          <div>
            <div className="flex items-center gap-2.5 text-[#2b64f6] font-bold text-xl mb-8">
              <span className="p-2 bg-white rounded-xl shadow-sm text-base">
                🛍️
              </span>
              <span className="text-[#0038DC] font-bold text-xl tracking-tight">
                ShopEase
              </span>
            </div>

            <h1 className="text-3xl md:text-[2.6rem] font-bold text-[#10245A] mb-3 leading-[1.15] tracking-tight">
              Better Sound.
              <br />
              Every Moment.
            </h1>
            <p className="text-[#6b7280] text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              Sign in to your account and get the best deals, track your
              orders, and enjoy a personalized experience.
            </p>
          </div>

          <div className="relative flex justify-center items-center my-6 py-2">
            <div className="absolute left-0 top-0 z-20 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white flex items-center gap-1.5">
              <span className="text-xs">🎧</span>
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC]">
                YOUR MUSIC
              </span>
            </div>

            <img
              src="/Rounded Pedestal & Headphones.svg"
              alt="Headphones with Pedestal"
              className="w-[300px] h-auto object-cover block"
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm border border-white">
              <span className="text-[11px] font-bold tracking-wider text-[#0038DC]">
                OUR WAY —
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between w-full pt-2">
            <div className="bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white">
              <svg
                className="w-3.5 h-3.5 text-[#2b64f6]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span className="text-[11px] font-bold text-[#0038DC]">
                Studio Quality Audio
              </span>
            </div>

            <div className="bg-[#e6f4ea] px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e]"></span>
              <span className="text-[11px] font-bold text-[#1e8e3e]">
                In Stock
              </span>
            </div>
          </div>
        </div>

        {/* ================= Right Side ================= */}
        <div className="lg:col-span-6 py-12 px-8 md:px-12 flex flex-col justify-center bg-white rounded-t-[32px] lg:rounded-t-none lg:rounded-l-[32px] shadow-2xl relative z-30">
          <div className="max-w-[460px] w-full mx-auto">
            <h2 className="text-5xl font-bold text-[#10245A] mb-3 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-base text-[#64748b] mb-6 font-medium">
              Sign in to your ShopEase account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#eff4ff] border border-[#dbe5ff] text-base text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 focus:border-[#2b64f6] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full px-5 py-3.5 rounded-2xl bg-[#eff4ff] border border-[#dbe5ff] text-base text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 focus:border-[#2b64f6] transition-all pr-12 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors p-1"
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
                    className="w-4 h-4 rounded border-[#cbd5e1] text-[#2b64f6] focus:ring-[#2b64f6] cursor-pointer"
                  />
                  <span className="text-sm text-[#64748b] font-semibold">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot"
                  className="text-sm font-bold text-[#2b64f6] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-[#2b64f6] hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 text-base mt-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? "Signing in..." : "Login"}</span>
                <svg
                  className="w-5 h-5"
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
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-[#e2e8f0] w-full"></div>
              <span className="bg-white px-4 text-xs text-[#94a3b8] absolute font-semibold uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 border-2 border-[#e2e8f0] rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold text-[#334155] active:scale-[0.98]"
              >
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 border-2 border-[#e2e8f0] rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-bold text-[#334155] active:scale-[0.98]"
              >
                Apple
              </button>
            </div>

            <p className="text-center text-sm text-[#94a3b8] mt-8 font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#2b64f6] font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}