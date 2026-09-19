import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendForgotPasswordOtp } from "../../api/auth.api";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await sendForgotPasswordOtp({ email });
      console.log("OTP sent successfully:", response.data);


    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      
     
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2b64f6]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0038DC]/10 blur-[120px] pointer-events-none"></div>

      {/* ================= Container ================= */}
      <div className="w-full max-w-[500px] bg-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-[#e2e8f0]/80 relative z-10 transition-all duration-300">

        {/* Logo Header */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <span className="p-2.5 bg-[#eff4ff] rounded-2xl shadow-sm text-lg border border-[#dbe5ff]">
            🛍️
          </span>

          <span className="text-[#0038DC] font-extrabold text-2xl tracking-tight">
            ShopEase
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[2rem] font-bold text-[#10245A] mb-2 tracking-tight">
            Forgot Password?
          </h1>

          <p className="text-xs md:text-sm text-[#64748b] font-medium leading-relaxed max-w-[380px] mx-auto">
            No worries! Enter your registered email address and we'll send you an OTP code to reset your password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-200 font-medium text-center animate-shake">
            {error}
          </div>
        )}

        {/* ================= Form ================= */}
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold text-[#334155] mb-2">
              Email address
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                ✉️
              </span>

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#eff4ff] border border-[#dbe5ff] text-xs md:text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 focus:border-[#2b64f6] transition-all font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-5 bg-[#2b64f6] hover:bg-[#1d4ed8] text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50 cursor-pointer"
          >
            <span>
              {loading ? "Sending Code..." : "Send Reset Code"}
            </span>

            <svg
              className="w-4 h-4"
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

          {/* Back to Login Link */}
          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2b64f6] hover:text-[#1d4ed8] hover:underline transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}