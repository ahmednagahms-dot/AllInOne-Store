export const months = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getAvailableYears(orders = []) {
  const years = new Set(
    orders
      .map((o) => new Date(o.createdAt).getFullYear())
      .filter((y) => !isNaN(y))
  );
  years.add(new Date().getFullYear());
  return Array.from(years).sort((a, b) => b - a);
}

function isInPeriod(dateString, year, month) {
  if (!dateString) return false;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return false;

  if (d.getFullYear() !== year) return false;
  if (month === "All") return true;
  return d.getMonth() === months.indexOf(month) - 1;
}

export function getPreviousPeriod(year, month) {
  if (month === "All") {
    return { year: year - 1, month: "All" };
  }

  const idx = months.indexOf(month) - 1; // 0-based month index
  if (idx <= 0) {
    return { year: year - 1, month: "December" };
  }
  return { year, month: months[idx] };
}

export function filterByPeriod(items = [], dateField, year, month) {
  return items.filter((item) => isInPeriod(item[dateField], year, month));
}

export function calcGrowth(current, previous) {
  if (!previous || previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Builds a simple time series.
 * - If month === "All" → monthly buckets (Jan–Dec)
 * - If specific month → weekly buckets (W1–W5)
 */
export function buildSeries(items = [], dateField, valueFn, year, month) {
  const buckets = {};

  if (month === "All") {
    months.slice(1).forEach((m) => {
      buckets[m.slice(0, 3)] = 0;
    });

    items.forEach((item) => {
      const d = new Date(item[dateField]);
      if (isNaN(d.getTime()) || d.getFullYear() !== year) return;
      const key = months[d.getMonth() + 1].slice(0, 3);
      buckets[key] += valueFn(item);
    });
  } else {
    for (let w = 1; w <= 5; w++) {
      buckets[`W${w}`] = 0;
    }

    items.forEach((item) => {
      if (!isInPeriod(item[dateField], year, month)) return;
      const d = new Date(item[dateField]);
      const week = Math.min(5, Math.ceil(d.getDate() / 7));
      buckets[`W${week}`] += valueFn(item);
    });
  }

  return Object.entries(buckets).map(([label, value]) => ({ label, value }));
}

export function buildTopProducts(periodOrders = []) {
  const map = {};

  periodOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = item.product || item.name || Math.random().toString(36);
      if (!map[key]) {
        map[key] = {
          name: item.name || "Unknown",
          image: item.image || null,
          sold: 0,
          revenue: 0,
        };
      }
      map[key].sold += item.quantity || 0;
      map[key].revenue += (item.price || 0) * (item.quantity || 0);
    });
  });

  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export function buildOrderStatusBreakdown(periodOrders = []) {
  const map = {};

  periodOrders.forEach((o) => {
    const status = o.status || "unknown";
    map[status] = (map[status] || 0) + 1;
  });

  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

export function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}