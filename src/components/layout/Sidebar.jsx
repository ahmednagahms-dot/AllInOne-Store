import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { LogOut, X, User } from "lucide-react";
import { sidebarLinks } from "../../data/sidebarLinks";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function Sidebar({ onClose }) {
  const { logoutUser, user } = useAuth();
  const { t } = useTranslation();

  return (
    <aside className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 shrink-0 flex items-center justify-center">
            <img
              src={STORE_LOGO_URL}
              alt="AllInOne"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900">AllInOne</h1>
            <p className="text-[11px] text-slate-400">E-commerce Admin</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {sidebarLinks.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="px-3 text-[11px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">
              {t(group.section)}
            </p>
            {group.items.map((item) => {
              const Icon = Icons[item.icon];
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  {t(item.label)}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold shrink-0 overflow-hidden shadow-xs">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : user?.username ? (
              user.username.charAt(0).toUpperCase()
            ) : (
              <User size={14} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-slate-900 text-xs font-semibold truncate">
              {user?.username}
            </p>
            <p className="text-slate-400 text-[11px] capitalize font-medium">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logoutUser();
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 font-medium transition cursor-pointer"
        >
          <LogOut size={18} />
          {t("navigation.logout")}
        </button>
      </div>
    </aside>
  );
}