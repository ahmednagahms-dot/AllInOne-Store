import { useTranslation } from "react-i18next";

const STATUS_STYLES = {
  paid: { label: "Paid", classes: "bg-success/10 text-success dark:bg-emerald-950/50 dark:text-emerald-400" },
  unpaid: { label: "Unpaid", classes: "bg-warning/10 text-warning dark:bg-amber-950/50 dark:text-amber-400" },
  pending: { label: "Pending", classes: "bg-warning/10 text-warning dark:bg-amber-950/50 dark:text-amber-400" },
  confirmed: { label: "Confirmed", classes: "bg-primary-500/10 text-primary-600 dark:bg-indigo-950/50 dark:text-indigo-400" },
  processing: { label: "Processing", classes: "bg-warning/10 text-warning dark:bg-amber-950/50 dark:text-amber-400" },
  shipped: { label: "Shipped", classes: "bg-primary-500/10 text-primary-600 dark:bg-indigo-950/50 dark:text-indigo-400" },
  delivered: { label: "Delivered", classes: "bg-success/10 text-success dark:bg-emerald-950/50 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", classes: "bg-danger/10 text-danger dark:bg-rose-950/50 dark:text-rose-400" },
};

export default function OrderStatusBadge({ status }) {
  const { t } = useTranslation();
  if (!status) return null;
  const key = String(status).toLowerCase();
  const config = STATUS_STYLES[key] || { label: status, classes: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" };
  const label = t(`orders.tabs.${key}`, { defaultValue: config.label });

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}