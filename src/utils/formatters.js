export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  });
};

export const formatCurrency = (amount, currency = "$") => {
  const num = Number(amount) || 0;
  return `${currency}${num.toLocaleString()}`;
};