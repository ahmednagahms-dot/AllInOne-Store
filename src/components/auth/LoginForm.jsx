import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify"; // 👈 استيراد الـ toast
import { useAuth } from "../../context/AuthContext";
import Input from "../ui/Input";
import SocialLoginButtons from "./SocialLoginButtons";

export default function LoginForm() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoginError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      if (data.user.role !== "admin") {
        setLoginError(t("auth.noAdminAccess"));
        return;
      }

      // 👈 1. إظهار رسالة النجاح
      toast.success(t("auth.loginSuccess") || "Logged in successfully!", {
        toastId: "login-success-toast",
      });

      // 👈 2. انتظار ثانيتين ليرى المستخدم الـ Toast ثم الانتقال للـ Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      const errorMessage = err.response?.data?.message;
      setLoginError(
        errorMessage
          ? t(errorMessage, { defaultValue: errorMessage })
          : t("auth.invalidCredentials")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary-600" size={24} />
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900">
            {t("auth.welcomeBack")}
          </h2>
          <p className="text-xs text-center text-slate-500 mt-1 mb-6">
            {t("auth.massage")}
          </p>

          <SocialLoginButtons
            onGoogleClick={() => {/* TODO: google auth */}}
            onFacebookClick={() => {/* TODO: facebook auth */}}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">{t("auth.or")}</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t("auth.email")}
              </label>
              <Input
                type="email"
                icon={Mail}
                error={errors.email?.message}
                {...register("email", { required: t("auth.emailRequired") })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {t("auth.password")}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                icon={Lock}
                error={errors.password?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register("password", { required: t("auth.passwordRequired") })}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 accent-primary-600"
                />
                <span>{t("auth.rememberMe")}</span>
              </label>
              <Link to="/forgot-password" className="font-semibold text-primary-600 hover:underline">
                {t("auth.forgotPassword")}
              </Link>
            </div>

            {loginError && (
              <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.signingIn") : t("auth.login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}