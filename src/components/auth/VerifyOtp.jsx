import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast"; 
import { verifyRegisterOtp, sendRegisterOtp } from "../../api/auth.api";
import { Loader2, Mail, ArrowLeft } from "lucide-react";

export default function VerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { email, username, password } = location.state || {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // No email in state
  if (!email) {
    return (
      <div className="min-h-screen w-full bg-[#f3f5fc] dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 text-center max-w-sm w-full border border-transparent dark:border-slate-800">
          <p className="text-gray-500 dark:text-slate-400 mb-4 text-sm">
            No verification data found
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-[#2b64f6] dark:text-indigo-400 font-semibold text-sm hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        email,
        otp: String(data.otp).trim(),
      };

      if (username) payload.username = username;
      if (password) payload.password = password;

      const res = await verifyRegisterOtp(payload);
      console.log("Verify response:", res.data);

      toast.success(
        res.data?.message || "Email verified successfully. Please log in."
      );

      navigate("/login", {
        replace: true,
        state: { email },
      });
    } catch (error) {
      console.error("Full error object from server:", error.response?.data);
      
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (Array.isArray(error.response?.data?.errors)
          ? error.response.data.errors[0]
          : null) ||
        "Invalid or expired verification code";
        
      toast.error(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      await sendRegisterOtp({
        email,
        username: username || email.split("@")[0],
        password: password || "tempPassword123",
      });

      toast.success("Code resent successfully");
    } catch (err) {
      console.error("Resend error details:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to resend code";
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f5fc] dark:bg-slate-950 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2b64f6] to-[#1e40af] dark:from-indigo-600 dark:to-indigo-900 px-8 py-10 text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
            <Mail size={28} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-sm text-blue-100">We sent a verification code to</p>
          <p className="text-sm font-semibold mt-1 break-all">{email}</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#334155] dark:text-slate-300 mb-2 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="• • • • • •"
                className="w-full px-4 py-4 border-2 border-[#dbe5ff] dark:border-slate-700 rounded-2xl text-center text-2xl font-bold tracking-[0.4em] text-[#10245A] dark:text-slate-100 bg-[#eff4ff] dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2b64f6] dark:focus:ring-indigo-500 focus:border-[#2b64f6] dark:focus:border-indigo-500 transition"
                {...register("otp", {
                  required: "Verification code is required",
                  minLength: { value: 4, message: "Code is incomplete" },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Code must contain numbers only",
                  },
                })}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-2 text-center font-medium">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2b64f6] dark:bg-indigo-600 hover:bg-blue-700 dark:hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 dark:shadow-indigo-600/30 transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Verifying..." : "Confirm Code"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-[#2b64f6] dark:text-indigo-400 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>

            <p className="text-xs text-[#64748b] dark:text-slate-400">
              <Link
                to="/signup"
                state={{ email, username, password }}
                className="font-semibold text-[#2b64f6] dark:text-indigo-400 hover:underline"
              >
                Back to Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}