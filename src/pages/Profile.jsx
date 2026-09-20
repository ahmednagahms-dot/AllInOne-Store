import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import {
  getMe,
  sendChangePasswordOtp,
  verifyChangePasswordOtp,
} from "../api/auth.api";
import {
  Lock,
  Loader2,
  Save,
  Pencil,
  ChevronDown,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logoutUser, updateUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });

  const [preferences, setPreferences] = useState({
    language: i18n.language?.startsWith("ar") ? "العربية" : "English",
    currency: "USD ($)",
    theme: "light",
  });

  const [passwordStep, setPasswordStep] = useState("idle");
  const [passwordEmail, setPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // =========================
  // Load profile (getMe + localStorage merge)
  // =========================
  useEffect(() => {
    const load = async () => {
      try {
        let userData = null;
        try {
          const res = await getMe();
          userData = res.data.user || res.data.data || res.data;
        } catch (err) {
          console.warn("getMe failed, using cache only:", err?.message);
        }

        // ✅ اجيب الكاش من localStorage
        let cached = {};
        try {
          const cachedStr = localStorage.getItem("profile_cache");
          cached = cachedStr ? JSON.parse(cachedStr) : {};
        } catch {
          cached = {};
        }

        // ✅ دالة مساعدة: تفرّق بين "قيمة فاضية" و "مفيش قيمة"
        const pickValue = (apiValue, cachedValue, fallback = "") => {
          if (
            apiValue !== undefined &&
            apiValue !== null &&
            apiValue !== ""
          )
            return apiValue;
          if (
            cachedValue !== undefined &&
            cachedValue !== null &&
            cachedValue !== ""
          )
            return cachedValue;
          return fallback;
        };

        const currentLangLabel = i18n.language?.startsWith("ar")
          ? "العربية"
          : "English";

        // ✅ الـ merge: الأولوية للـ API، بس لو فاضي → الكاش
        const merged = {
          ...cached,
          ...(userData || {}),
          // حقول الـ API (بياخد من الكاش لو الـ API فاضي)
          avatar: pickValue(userData?.avatar, cached?.avatar, null),
          firstName: pickValue(userData?.firstName, cached?.firstName, ""),
          lastName: pickValue(userData?.lastName, cached?.lastName, ""),
          username: pickValue(userData?.username, cached?.username, ""),
          email: pickValue(userData?.email, cached?.email, ""),
          role: pickValue(userData?.role, cached?.role, "customer"),
          // ✅ حقول الكاش (الأولوية للكاش لأن الـ API مش بيرجعهم)
          phone: cached?.phone || userData?.phone || "",
          dateOfBirth: cached?.dateOfBirth || userData?.dateOfBirth || "",
          language: currentLangLabel,
          currency: cached?.currency || userData?.currency || "USD ($)",
          theme: cached?.theme || userData?.theme || "light",
        };

        setUser(merged);

        // ✅ افصل الاسم
        const fullName =
          merged?.firstName && merged?.lastName
            ? `${merged.firstName} ${merged.lastName}`
            : merged?.username || merged?.name || "";
        const [firstName = "", ...rest] = fullName.split(" ");
        const lastName = rest.join(" ");

        setForm({
          firstName: merged?.firstName || firstName || "",
          lastName: merged?.lastName || lastName || "",
          email: merged?.email || "",
          phone: merged?.phone || "",
          dateOfBirth: merged?.dateOfBirth
            ? String(merged.dateOfBirth).slice(0, 10)
            : "",
        });

        setPasswordEmail(merged?.email || "");

        setPreferences({
          language: currentLangLabel,
          currency: merged?.currency || "USD ($)",
          theme: merged?.theme || "light",
        });

        // ✅ احفظ النسخة المدمجة في localStorage + cookies
        localStorage.setItem("profile_cache", JSON.stringify(merged));
        Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });

        setIsEditing(false);
      } catch (err) {
        console.error(err);
        toast.error(t("profile.loadError") || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [i18n.language, t]);

  // Keep preferences language synchronized with global i18n
  useEffect(() => {
    setPreferences((prev) => ({
      ...prev,
      language: i18n.language?.startsWith("ar") ? "العربية" : "English",
    }));
  }, [i18n.language]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // Save profile (localStorage only)
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);

      const merged = {
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || "",
        language: preferences.language,
        currency: preferences.currency,
        theme: preferences.theme,
      };

      setUser(merged);
      if (updateUser) updateUser(merged);

      // إذا غيّر المستخدم اللغة من التفضيلات، نطبقها فوراً في i18next
      if (
        preferences.language === "العربية" &&
        !i18n.language?.startsWith("ar")
      ) {
        i18n.changeLanguage("ar");
        localStorage.setItem("language", "ar");
      } else if (
        preferences.language === "English" &&
        !i18n.language?.startsWith("en")
      ) {
        i18n.changeLanguage("en");
        localStorage.setItem("language", "en");
      }

      // ✅ احفظ في localStorage + cookies
      localStorage.setItem("profile_cache", JSON.stringify(merged));
      Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });

      toast.success(t("profile.updateSuccess") || "Profile updated");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(t("profile.updateError") || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;

    const fullName =
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || user?.name || "";
    const [firstName = "", ...rest] = fullName.split(" ");
    const lastName = rest.join(" ");

    setForm({
      firstName: user?.firstName || firstName || "",
      lastName: user?.lastName || lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.dateOfBirth
        ? String(user.dateOfBirth).slice(0, 10)
        : "",
    });

    setPreferences({
      language:
        user?.language ||
        (i18n.language?.startsWith("ar") ? "العربية" : "English"),
      currency: user?.currency || "USD ($)",
      theme: user?.theme || "light",
    });

    setIsEditing(false);
  };

  // =========================
  // Change Password
  // =========================
  const handleStartChangePassword = () => {
    setPasswordStep("email");
    setPasswordEmail(user?.email || "");
  };

  const handleSendOtp = async () => {
    if (!passwordEmail.trim()) {
      toast.error(t("profile.enterEmailError") || "Please enter your email");
      return;
    }

    try {
      setSendingOtp(true);
      await sendChangePasswordOtp({ email: passwordEmail.trim() });
      toast.success(t("profile.otpSent") || "OTP sent to your email");
      setPasswordStep("otp");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          t("profile.otpSendError") ||
          "Failed to send OTP"
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      toast.error(t("profile.enterOtpError") || "Please enter the OTP");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(
        t("profile.passwordLengthError") ||
          "Password must be at least 6 characters"
      );
      return;
    }

    try {
      setResettingPassword(true);
      await verifyChangePasswordOtp({
        email: passwordEmail.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success(
        t("profile.passwordChangeSuccess") ||
          "Password changed successfully"
      );
      setPasswordStep("idle");
      setOtp("");
      setNewPassword("");
      setShowPassword(false);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          t("profile.passwordChangeError") ||
          "Failed to change password"
      );
    } finally {
      setResettingPassword(false);
    }
  };

  const handleCancelChangePassword = () => {
    setPasswordStep("idle");
    setOtp("");
    setNewPassword("");
    setShowPassword(false);
    setPasswordEmail(user?.email || "");
  };

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    logoutUser();
    toast.success(t("profile.loggedOut") || "Logged out");
    navigate("/login");
  };

  // =========================
  // Loading / empty
  // =========================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-lg">
          {t("profile.pleaseLogin") || "Please login first"}
        </p>
      </div>
    );
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || user.name || "User";

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {t("profile.title") || "Account Settings"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("profile.subtitle") ||
                "Manage your account information and preferences"}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition"
            >
              <Pencil size={14} />
              {t("profile.editProfile") || "Edit Profile"}
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            {t("profile.profileInfo") || "Profile Information"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            {/* Avatar — read-only */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">
                    {(displayName || "U")[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t("profile.firstName") || "First name"}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t("profile.lastName") || "Last name"}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t("profile.email") || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t("profile.phone") || "Phone"}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        disabled={!isEditing}
                        className="appearance-none px-3 py-2.5 pr-8 rtl:pr-3 rtl:pl-8 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white disabled:bg-slate-50 disabled:text-slate-500"
                      >
                        <option>+20</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+966</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 rtl:right-auto rtl:left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      dir="ltr"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  {t("profile.dateOfBirth") || "Date of birth"}
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 disabled:text-slate-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800">
              {t("profile.preferences") || "Preferences"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t("profile.preferencesDesc") ||
                "Set your preferred language, currency and theme"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {t("profile.language") || "Language"}
              </label>
              <div className="relative">
                <select
                  value={preferences.language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setPreferences((prev) => ({
                      ...prev,
                      language: newLang,
                    }));
                    if (newLang === "العربية") {
                      i18n.changeLanguage("ar");
                      localStorage.setItem("language", "ar");
                    } else if (newLang === "English") {
                      i18n.changeLanguage("en");
                      localStorage.setItem("language", "en");
                    }
                  }}
                  disabled={!isEditing}
                  className="w-full appearance-none px-3 py-2.5 pr-9 rtl:pr-3 rtl:pl-9 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option value="English">
                    {t("profile.languageEnglish") || "English"}
                  </option>
                  <option value="العربية">
                    {t("profile.languageArabic") || "العربية"}
                  </option>
                  <option value="Français">
                    {t("profile.languageFrench") || "Français"}
                  </option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {t("profile.currency") || "Currency"}
              </label>
              <div className="relative">
                <select
                  value={preferences.currency}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      currency: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full appearance-none px-3 py-2.5 pr-9 rtl:pr-3 rtl:pl-9 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white disabled:bg-slate-50 disabled:text-slate-500"
                >
                  <option>USD ($)</option>
                  <option>EGP (E£)</option>
                  <option>EUR (€)</option>
                  <option>SAR (﷼)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {t("profile.theme") || "Theme"}
              </label>
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                {["light", "dark", "auto"].map((themeKey) => {
                  const labelMap = {
                    light: t("profile.themeLight") || "Light",
                    dark: t("profile.themeDark") || "Dark",
                    auto: t("profile.themeAuto") || "Auto",
                  };
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() =>
                        isEditing &&
                        setPreferences({
                          ...preferences,
                          theme: themeKey,
                        })
                      }
                      disabled={!isEditing}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                        preferences.theme === themeKey
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                    >
                      {labelMap[themeKey] || themeKey}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              {t("profile.changePassword") || "Change Password"}
            </h2>
          </div>

          {passwordStep === "idle" && (
            <button
              type="button"
              onClick={handleStartChangePassword}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition"
            >
              {t("profile.changePassword") || "Change Password"}
            </button>
          )}

          {passwordStep === "email" && (
            <>
              <p className="text-xs text-slate-500 mb-4">
                {t("profile.otpInstruction") ||
                  "We'll send an OTP to your email to verify your identity."}
              </p>
              <input
                type="email"
                placeholder={t("profile.email") || "Email"}
                value={passwordEmail}
                onChange={(e) => setPasswordEmail(e.target.value)}
                className="w-full px-3 py-2.5 mb-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition disabled:opacity-60"
                >
                  {sendingOtp && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {t("profile.sendOtp") || "Send OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                >
                  {t("profile.cancel") || "Cancel"}
                </button>
              </div>
            </>
          )}

          {passwordStep === "otp" && (
            <>
              <input
                type="text"
                placeholder={t("profile.enterOtp") || "Enter OTP"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2.5 mb-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white"
              />

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("profile.newPassword") || "New password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rtl:pr-3 rtl:pl-10 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={resettingPassword}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition disabled:opacity-60"
                >
                  {resettingPassword && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {t("profile.resetPassword") || "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                >
                  {t("profile.cancel") || "Cancel"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {isEditing && (
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              {t("profile.cancel") || "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition disabled:opacity-60 shadow-sm"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {t("profile.saveChanges") || "Save Changes"}
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
        >
          <LogOut size={16} />
          {t("profile.logout") || "Logout"}
        </button>
      </div>
    </div>
  );
}