import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../../api/auth.api";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast"; 

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function ForgetPassword() {
  const navigate = useNavigate();

  // step: "email" | "reset"
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================
  // Step 1: Send OTP
  // =========================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await sendForgotPasswordOtp({ email: email.trim() });
      toast.success("OTP sent to your email");
      setStep("reset");
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        "Failed to send OTP. Please check your email and try again.";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Step 2: OTP + New Password
  // =========================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP");
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.trim().length < 4) {
      setError("OTP seems too short");
      toast.error("OTP seems too short");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await verifyForgotPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success("Password reset successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = (err.response?.data?.message || "").toLowerCase();
      let errMsg = "";

      if (
        msg.includes("otp") ||
        msg.includes("invalid") ||
        msg.includes("expired")
      ) {
        errMsg = "Invalid or expired OTP. Please check and try again.";
      } else {
        errMsg =
          err.response?.data?.message ||
          "Failed to reset password. Please try again.";
      }
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Resend OTP
  // =========================
  const handleResendOtp = async () => {
    setError("");
    try {
      setLoading(true);
      await sendForgotPasswordOtp({ email: email.trim() });
      toast.success("OTP resent to your email");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to resend OTP";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Back
  // =========================
  const handleBack = () => {
    setError("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("email");
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] dark:bg-slate-950 flex items-center justify-center p-4 md:p-6 font-sans relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#2b64f6]/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0038DC]/10 dark:bg-indigo-700/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[500px] bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-[#e2e8f0]/80 dark:border-slate-800 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src={STORE_LOGO_URL}
              alt="AllInOne"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-black dark:text-white">
              AllIn
              <span className="text-[#2b64f6] dark:text-indigo-400">One</span>
            </span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-[2rem] font-bold text-[#10245A] dark:text-slate-100 mb-2 tracking-tight">
            {step === "email" ? "Forgot Password?" : "Reset Password"}
          </h1>
          <p className="text-xs md:text-sm text-[#64748b] dark:text-slate-400 font-medium leading-relaxed max-w-[380px] mx-auto">
            {step === "email"
              ? "No worries! Enter your registered email address and we'll send you an OTP code to reset your password."
              : `Enter the OTP sent to ${email} and choose a new password.`}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {["email", "reset"].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-8 bg-[#2b64f6] dark:bg-indigo-500"
                  : i < ["email", "reset"].indexOf(step)
                  ? "w-6 bg-[#2b64f6]/60 dark:bg-indigo-500/60"
                  : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Error box inside UI */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 dark:bg-rose-950/50 text-red-600 dark:text-rose-400 text-xs rounded-xl border border-red-200 dark:border-rose-900/60 font-medium text-center">
            {error}
          </div>
        )}

        {/* ================= Step 1: Email ================= */}
        {step === "email" && (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <div>
              <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 bg-[#2b64f6] dark:bg-indigo-600 hover:bg-[#1d4ed8] dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-indigo-600/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{loading ? "Sending Code..." : "Send Reset Code"}</span>
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2b64f6] dark:text-indigo-400 hover:text-[#1d4ed8] dark:hover:text-indigo-300 hover:underline transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* ================= Step 2: OTP + New Password ================= */}
        {step === "reset" && (
          <form className="space-y-5" onSubmit={handleResetPassword}>
            {/* OTP */}
            <div>
              <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-2">
                Verification code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • • • •"
                maxLength={6}
                inputMode="numeric"
                autoFocus
                className="w-full px-4 py-4 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-center text-2xl font-bold tracking-[0.4em] text-[#10245A] dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-2">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3.5 pr-11 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400 hover:text-[#475569] dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  className="w-full px-4 py-3.5 pr-11 rounded-xl bg-[#eff4ff] dark:bg-slate-800 border border-[#dbe5ff] dark:border-slate-700 text-xs md:text-sm text-[#0f172a] dark:text-slate-100 placeholder-[#94a3b8] dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2b64f6]/30 dark:focus:ring-indigo-500/30 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] dark:text-slate-400 hover:text-[#475569] dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Hints */}
            {newPassword && newPassword.length < 6 && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Password is too short (min 6 characters)
              </p>
            )}
            {newPassword &&
              confirmPassword &&
              newPassword === confirmPassword &&
              newPassword.length >= 6 && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✅ Passwords match
                </p>
              )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 bg-[#2b64f6] dark:bg-indigo-600 hover:bg-[#1d4ed8] dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-indigo-600/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:underline"
              >
                ← Change email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-xs font-bold text-[#2b64f6] dark:text-indigo-400 hover:underline disabled:opacity-50"
              >
                Resend code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}