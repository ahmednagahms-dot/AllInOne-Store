import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";
import {
  getMe,
  sendChangePasswordOtp,
  verifyChangePasswordOtp,
} from "../api/auth.api";
import { uploadToCloudinary } from "../utils/upload";
import {
  Camera,
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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

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
  // Load profile (getMe + cache merge)
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

        let cached = {};
        try {
          const cachedStr = Cookies.get("store_user");
          cached = cachedStr ? JSON.parse(cachedStr) : {};
        } catch {
          cached = {};
        }

        const currentLangLabel = i18n.language?.startsWith("ar")
          ? "العربية"
          : "English";

        const merged = {
          ...cached,
          ...(userData || {}),
          avatar: userData?.avatar || cached?.avatar || null,
          firstName: userData?.firstName || cached?.firstName || "",
          lastName: userData?.lastName || cached?.lastName || "",
          username: userData?.username || cached?.username || "",
          language: currentLangLabel,
          currency: userData?.currency || cached?.currency || "USD ($)",
          theme: userData?.theme || cached?.theme || "light",
          dateOfBirth: userData?.dateOfBirth || cached?.dateOfBirth || "",
        };

        setUser(merged);
        setAvatarPreview(merged?.avatar || null);

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

        Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });
        setIsEditing(false);
      } catch (err) {
        console.error(err);
        toast.error(t("profile.loadError"));
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

  // =========================
  // Avatar
  // =========================
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t("profile.imageSizeError"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // Save profile (محلي فقط)
  // =========================
  const handleSave = async () => {
    try {
      setSaving(true);

      let avatarUrl = null;

      // 1. ارفع الصورة على Cloudinary
      if (avatarFile) {
        try {
          setUploadingAvatar(true);
          avatarUrl = await uploadToCloudinary(avatarFile);
        } catch (err) {
          console.error("Avatar upload failed:", err);
          toast.error(t("profile.uploadAvatarError"));
          setUploadingAvatar(false);
          setSaving(false);
          return;
        } finally {
          setUploadingAvatar(false);
        }
      }

      // 2. ✅ احفظ محلياً (الـ Backend مش بيدعم التعديل)
      const merged = {
        ...user,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || "",
        language: preferences.language,
        currency: preferences.currency,
        theme: preferences.theme,
        ...(avatarUrl && { avatar: avatarUrl }),
      };

      setUser(merged);
      if (updateUser) updateUser(merged);

      // إذا غيّر المستخدم اللغة من التفضيلات، نطبقها فوراً في i18next
      if (preferences.language === "العربية" && !i18n.language?.startsWith("ar")) {
        i18n.changeLanguage("ar");
        localStorage.setItem("language", "ar");
      } else if (preferences.language === "English" && !i18n.language?.startsWith("en")) {
        i18n.changeLanguage("en");
        localStorage.setItem("language", "en");
      }

      // 3. احفظ في الـ cookies
      Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });

      setAvatarFile(null);
      if (avatarUrl) setAvatarPreview(avatarUrl);

      toast.success(t("profile.updateSuccess"));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error(t("profile.updateError"));
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
      language: user?.language || (i18n.language?.startsWith("ar") ? "العربية" : "English"),
      currency: user?.currency || "USD ($)",
      theme: user?.theme || "light",
    });

    setAvatarPreview(user?.avatar || null);
    setAvatarFile(null);
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
      toast.error(t("profile.enterEmailError"));
      return;
    }

    try {
      setSendingOtp(true);
      await sendChangePasswordOtp({ email: passwordEmail.trim() });
      toast.success(t("profile.otpSent"));
      setPasswordStep("otp");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("profile.otpSendError"));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      toast.error(t("profile.enterOtpError"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("profile.passwordLengthError"));
      return;
    }

    try {
      setResettingPassword(true);
      await verifyChangePasswordOtp({
        email: passwordEmail.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success(t("profile.passwordChangeSuccess"));
      setPasswordStep("idle");
      setOtp("");
      setNewPassword("");
      setShowPassword(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("profile.passwordChangeError"));
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
    toast.success(t("profile.loggedOut"));
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
        <p className="text-slate-500 text-lg">{t("profile.pleaseLogin")}</p>
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
              {t("profile.title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("profile.subtitle")}
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition"
            >
              <Pencil size={14} />
              {t("profile.editProfile")}
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-6">
            {t("profile.profileInfo")}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {(displayName || "U")[0].toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  disabled={!isEditing || uploadingAvatar}
                  className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={t("profile.changeAvatar")}
                  title={
                    isEditing ? t("profile.changeAvatar") : t("profile.clickEditFirst")
                  }
                >
                  {uploadingAvatar ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={16} />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <button
                type="button"
                onClick={() => isEditing && fileInputRef.current?.click()}
                disabled={!isEditing || uploadingAvatar}
                className="mt-3 text-sm text-indigo-600 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploadingAvatar
                  ? t("profile.uploading")
                  : isEditing
                  ? t("profile.changePhoto")
                  : t("profile.editToChangePhoto")}
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    {t("profile.firstName")}
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
                    {t("profile.lastName")}
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
                    {t("profile.email")}
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
                    {t("profile.phone")}
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
                  {t("profile.dateOfBirth")}
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
              {t("profile.preferences")}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t("profile.preferencesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                {t("profile.language")}
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
                {t("profile.currency")}
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
                {t("profile.theme")}
              </label>
              <div className="flex items-center bg-slate-100 rounded-xl p-1">
                {["light", "dark", "auto"].map((themeKey) => {
                  const labelMap = {
                    light: t("profile.themeLight"),
                    dark: t("profile.themeDark"),
                    auto: t("profile.themeAuto"),
                  };
                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() =>
                        isEditing && setPreferences({ ...preferences, theme: themeKey })
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
              {t("profile.changePassword")}
            </h2>
          </div>

          {passwordStep === "idle" && (
            <button
              type="button"
              onClick={handleStartChangePassword}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition"
            >
              {t("profile.changePassword")}
            </button>
          )}

          {passwordStep === "email" && (
            <>
              <p className="text-xs text-slate-500 mb-4">
                {t("profile.otpInstruction")}
              </p>
              <input
                type="email"
                placeholder={t("profile.email")}
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
                  {t("profile.sendOtp")}
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                >
                  {t("profile.cancel")}
                </button>
              </div>
            </>
          )}

          {passwordStep === "otp" && (
            <>
              <input
                type="text"
                placeholder={t("profile.enterOtp")}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2.5 mb-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white"
              />

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("profile.newPassword")}
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
                  {t("profile.resetPassword")}
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                >
                  {t("profile.cancel")}
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
              {t("profile.cancel")}
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
              {t("profile.saveChanges")}
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
          {t("profile.logout")}
        </button>
      </div>
    </div>
  );
}