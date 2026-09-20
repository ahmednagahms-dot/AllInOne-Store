import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    language: "English",
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
          if (apiValue !== undefined && apiValue !== null && apiValue !== "")
            return apiValue;
          if (
            cachedValue !== undefined &&
            cachedValue !== null &&
            cachedValue !== ""
          )
            return cachedValue;
          return fallback;
        };

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
          language: cached?.language || userData?.language || "English",
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
          language: merged?.language || "English",
          currency: merged?.currency || "USD ($)",
          theme: merged?.theme || "light",
        });

        // ✅ احفظ النسخة المدمجة في localStorage + cookies
        localStorage.setItem("profile_cache", JSON.stringify(merged));
        Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });

        setIsEditing(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

      // ✅ احفظ في localStorage + cookies
      localStorage.setItem("profile_cache", JSON.stringify(merged));
      Cookies.set("store_user", JSON.stringify(merged), { expires: 7 });

      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
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
      language: user?.language || "English",
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
      toast.error("Please enter your email");
      return;
    }

    try {
      setSendingOtp(true);
      await sendChangePasswordOtp({ email: passwordEmail.trim() });
      toast.success("OTP sent to your email");
      setPasswordStep("otp");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setResettingPassword(true);
      await verifyChangePasswordOtp({
        email: passwordEmail.trim(),
        otp: otp.trim(),
        newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordStep("idle");
      setOtp("");
      setNewPassword("");
      setShowPassword(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to change password");
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
    toast.success("Logged out");
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
        <p className="text-slate-500 text-lg">Please login first</p>
      </div>
    );
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || user.name || "User";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Account Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your account information and preferences
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-6">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            {/* Avatar — read-only */}
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
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
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    First name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Last name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500 bg-white dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none bg-slate-50 dark:bg-slate-700/50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Phone
                  </label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <select
                        disabled={!isEditing}
                        className="appearance-none px-3 py-2.5 pr-8 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500"
                      >
                        <option>+20</option>
                        <option>+1</option>
                        <option>+44</option>
                        <option>+966</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500 bg-white dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Date of birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500 bg-white dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Set your preferred language, currency and theme
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Language
              </label>
              <div className="relative">
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      language: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500"
                >
                  <option>English</option>
                  <option>العربية</option>
                  <option>Français</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Currency
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
                  className="w-full appearance-none px-3 py-2.5 pr-9 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white disabled:bg-slate-50 dark:disabled:bg-slate-700/50 disabled:text-slate-500"
                >
                  <option>USD ($)</option>
                  <option>EGP (E£)</option>
                  <option>EUR (€)</option>
                  <option>SAR (﷼)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Theme
              </label>
              <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
                {["light", "dark", "auto"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      isEditing && setPreferences({ ...preferences, theme: t })
                    }
                    disabled={!isEditing}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                      preferences.theme === t
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    } ${!isEditing ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Change Password
            </h2>
          </div>

          {passwordStep === "idle" && (
            <button
              type="button"
              onClick={handleStartChangePassword}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
            >
              Change Password
            </button>
          )}

          {passwordStep === "email" && (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                We&apos;ll send an OTP to your email to verify your identity.
              </p>
              <input
                type="email"
                placeholder="Email"
                value={passwordEmail}
                onChange={(e) => setPasswordEmail(e.target.value)}
                className="w-full px-3 py-2.5 mb-3 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white"
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
                  Send OTP
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {passwordStep === "otp" && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2.5 mb-3 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white"
              />

              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-slate-600 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition bg-white dark:bg-slate-900 dark:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                  Reset Password
                </button>
                <button
                  type="button"
                  onClick={handleCancelChangePassword}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition"
                >
                  Cancel
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
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancel
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
              Save Changes
            </button>
          </div>
        )}

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}