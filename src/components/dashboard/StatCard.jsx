import * as Icons from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import Sparkline from "./Sparkline";

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    line: "#3b82f6",
  },
  green: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    line: "#10b981",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    line: "#a855f7",
  },
  orange: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    line: "#f97316",
  },
};

export default function StatCard({
  title,
  value,
  growth = 0,
  icon,
  color = "blue",
  sparkData = [],
}) {
  const { t } = useTranslation();
  const Icon = Icons[icon] || Icons.Activity;
  const c = colorMap[color] || colorMap.blue;
  const isPositive = growth >= 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ${c.text}`}
        >
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      {/* Title + Value */}
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
        {value}
      </h3>

      {/* Growth */}
      <div className="flex items-center gap-1.5 mt-2 text-xs">
        {isPositive ? (
          <TrendingUp size={13} className="text-emerald-500" />
        ) : (
          <TrendingDown size={13} className="text-red-500" />
        )}
        <span
          className={`font-medium ${
            isPositive ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {isPositive ? "+" : ""}
          {growth}%
        </span>
        <span className="text-gray-400">{t("dashboard.vsLastPeriod")}</span>
      </div>

      {/* Sparkline */}
      <div className="mt-3 -mx-1">
        <Sparkline data={sparkData} color={c.line} />
      </div>
    </div>
  );
}