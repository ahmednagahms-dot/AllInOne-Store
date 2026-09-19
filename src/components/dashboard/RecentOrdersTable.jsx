import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const statusColor = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-indigo-100 text-indigo-700", processing: "bg-yellow-100 text-yellow-700", shipped: "bg-blue-100 text-blue-700", delivered: "bg-emerald-100 text-emerald-700", cancelled: "bg-red-100 text-red-700", returned: "bg-gray-100 text-gray-700" };

export default function RecentOrdersTable({ orders }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("dashboard.recentOrders")}</h3>
        <button onClick={() => navigate("/dashboard/orders")} className="text-xs text-primary-500">{t("dashboard.viewAllOrders")}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b">
              <th className="py-2 font-medium">{t("dashboard.order")}</th>
              <th className="py-2 font-medium">{t("dashboard.customer")}</th>
              <th className="py-2 font-medium">{t("dashboard.date")}</th>
              <th className="py-2 font-medium">{t("dashboard.amount")}</th>
              <th className="py-2 font-medium">{t("dashboard.status")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">{t("dashboard.noOrders")}</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id} className="border-b last:border-0 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/dashboard/orders")}>
                  <td className="py-3 font-medium text-primary-600">#{o._id.slice(-6)}</td>
                  <td className="py-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-semibold">
                      {o.shippingAddress?.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    {o.shippingAddress?.fullName || "—"}
                  </td>
                  <td className="py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", { month: "short", day: "numeric" })}</td>
                  <td className="py-3 font-medium">${o.totalPrice.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor[o.status]}`}>{o.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}