import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = {
  pending: "#f59e0b",
  confirmed: "#6366f1",
  processing: "#eab308",
  shipped: "#3b82f6",
  delivered: "#22c55e",
  cancelled: "#ef4444",
  returned: "#94a3b8",
};

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { status, count, percent } = payload[0].payload;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl rounded-xl px-3.5 py-2.5 text-sm">
      <p className="font-semibold capitalize text-gray-900">{status}</p>
      <p className="text-gray-500 mt-0.5">
        {count} orders · {percent}%
      </p>
    </div>
  );
};

export default function OrderStatusDonut({ data = [] }) {
  const { t } = useTranslation();
  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  const chartData = STATUS_ORDER.map((status) => {
    const found = data.find((d) => d.status === status);
    const count = found?.count || 0;
    return {
      status,
      count,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  }).filter((d) => d.count > 0);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {t("dashboard.ordersByStatus")}
          </h3>
          <span className="text-xs text-gray-400">{t("dashboard.thisPeriod")}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
            <span className="text-lg">—</span>
          </div>
          <p className="text-sm">No orders in this period</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800">
          {t("dashboard.ordersByStatus")}
        </h3>
        <span className="text-xs text-gray-400">{t("dashboard.thisPeriod")}</span>
      </div>

      {/* Centered Donut */}
      <div className="relative mx-auto" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2.5}
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={COLORS[entry.status] || "#cbd5e1"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold text-gray-900 leading-none tracking-tight">
            {total}
          </p>
          <p className="text-[11px] text-gray-400 mt-1 font-medium">{t("common.total")}</p>
        </div>
      </div>

      {/* Legend under the chart - centered */}
      <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {chartData.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-1.5 text-xs"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[item.status] }}
            />
            <span className="capitalize text-gray-600">{item.status}</span>
            <span className="font-semibold text-gray-800">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}