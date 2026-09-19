import { Bell, Menu, User, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";
import { useLocation } from "react-router-dom";
import { sidebarLinks } from "../../data/sidebarLinks";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import LanguageSwitcher from "../ui/LanguageSwitch";
import { useTranslation } from "react-i18next";

const allPages = sidebarLinks.flatMap((group) =>
  group.items.map((item) => ({ ...item, section: group.section })),
);

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const currentPage = allPages.find((item) => item.path === pathname);
  const PageIcon = Icons[currentPage?.icon] || Icons.LayoutDashboard;
  const pageTitle = currentPage?.label || "navigation.dashboard";

  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <PageIcon size={16} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              {t(pageTitle)}
            </h2>
          </div>
        </div>
      </div>


      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={t(isDark ? "common.lightMode" : "common.darkMode")}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="relative text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center overflow-hidden font-medium text-sm shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : user?.username ? (
              user.username.charAt(0).toUpperCase()
            ) : (
              <User size={16} />
            )}
          </div>
          <div className="text-sm hidden sm:block">
            <p className="font-medium text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
