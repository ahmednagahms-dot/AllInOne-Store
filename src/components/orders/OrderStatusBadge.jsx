import { useTranslation } from "react-i18next";

const STATUS_STYLES = {
  paid: { label: "Paid", classes: "bg-success/10 text-success" },
  unpaid: { label: "Unpaid", classes: "bg-warning/10 text-warning" },
  pending: { label: "Pending", classes: "bg-warning/10 text-warning" },
  confirmed: { label: "Confirmed", classes: "bg-primary-500/10 text-primary-600" },
  processing: { label: "Processing", classes: "bg-warning/10 text-warning" },
  shipped: { label: "Shipped", classes: "bg-primary-500/10 text-primary-600" },
  delivered: { label: "Delivered", classes: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", classes: "bg-danger/10 text-danger" },
};

export default function OrderStatusBadge({ status }) {
  const { t } = useTranslation();
  if (!status) return null;
  const key = String(status).toLowerCase();
  const config = STATUS_STYLES[key] || { label: status, classes: "bg-slate-100 text-slate-600" };
  const label = t(`orders.tabs.${key}`, { defaultValue: config.label });

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}