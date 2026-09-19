import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import DashboardLayout from "../components/layout/DashboardLayout";
import PageLoader from "../components/ui/sessionLoader/PageLoader";

import StatCard from "../components/dashboard/StatCard";
import SalesOverviewChart from "../components/dashboard/SalesOverviewChart";
import TopProductsList from "../components/dashboard/TopProductsList";
import OrderStatusDonut from "../components/dashboard/OrderStatusDonut";
import RecentOrdersTable from "../components/dashboard/RecentOrdersTable";

import {
  months,
  getAvailableYears,
  getPreviousPeriod,
  filterByPeriod,
  calcGrowth,
  buildSeries,
  buildTopProducts,
  buildOrderStatusBreakdown,
} from "../data/dashboardData";

import api from "../api/axios";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("All");

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get("/orders/admin?limit=1000"),
        api.get("/products?limit=500"),
        api.get("/users/all"),
      ]);

      setOrders(ordersRes.data?.orders || ordersRes.data || []);
      setProducts(productsRes.data?.products || productsRes.data || []);
      
      const usersList = usersRes.data?.users || usersRes.data || [];
      setCustomers(usersList.filter((u) => u.role === "customer"));
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try again.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const availableYears = useMemo(() => {
    const years = getAvailableYears(orders);
    const currentYear = new Date().getFullYear();
    const combined = years.includes(currentYear) ? years : [currentYear, ...years];
    return Array.from(new Set(combined)); // يمنع تكرار السنة في المفاتيح
  }, [orders]);

  // ===================== Derived Data =====================
  const data = useMemo(() => {
    const periodOrders = filterByPeriod(orders, "createdAt", year, month);
    const prev = getPreviousPeriod(year, month);
    const prevOrders = filterByPeriod(orders, "createdAt", prev.year, prev.month);

    const periodCustomers = filterByPeriod(customers, "createdAt", year, month);
    const prevCustomers = filterByPeriod(customers, "createdAt", prev.year, prev.month);

    const periodProducts = filterByPeriod(products, "createdAt", year, month);
    const prevProducts = filterByPeriod(products, "createdAt", prev.year, prev.month);

    const validOrders = periodOrders.filter((o) => o.status !== "cancelled");
    const prevValidOrders = prevOrders.filter((o) => o.status !== "cancelled");

    const revenue = validOrders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const prevRevenue = prevValidOrders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    const revenueSeries = buildSeries(
      orders,
      "createdAt",
      (o) => Number(o.totalPrice || 0),
      year,
      month
    );
    const ordersSeries = buildSeries(orders, "createdAt", () => 1, year, month);
    const customersSeries = buildSeries(customers, "createdAt", () => 1, year, month);
    const productsSeries = buildSeries(products, "createdAt", () => 1, year, month);

    return {
      stats: [
        {
          title: t("dashboard.totalRevenue"),
          value: `$${revenue.toLocaleString()}`,
          growth: calcGrowth(revenue, prevRevenue),
          icon: "Wallet",
          color: "blue",
          sparkData: revenueSeries,
        },
        {
          title: t("dashboard.totalOrders"),
          value: periodOrders.length.toLocaleString(),
          growth: calcGrowth(periodOrders.length, prevOrders.length),
          icon: "ShoppingBag",
          color: "green",
          sparkData: ordersSeries,
        },
        {
          title: t("dashboard.totalCustomers"),
          value: customers.length.toLocaleString(),
          growth: calcGrowth(periodCustomers.length, prevCustomers.length),
          icon: "Users",
          color: "purple",
          sparkData: customersSeries,
        },
        {
          title: t("dashboard.totalProducts"),
          value: products.length.toLocaleString(),
          growth: calcGrowth(periodProducts.length, prevProducts.length),
          icon: "Package",
          color: "orange",
          sparkData: productsSeries,
        },
      ],
      salesData: {
        revenue: revenueSeries,
        orders: ordersSeries,
      },
      topProducts: buildTopProducts(periodOrders),
      statusBreakdown: buildOrderStatusBreakdown(periodOrders),
    };
  }, [orders, products, customers, year, month, t]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [orders]
  );

  // ===================== Render =====================
  return (
    <DashboardLayout>
      {loading ? (
        <PageLoader text={t("dashboard.loading")} />
      ) : (
        <div className="p-4 sm:p-6 w-full animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>

              <p className="text-sm text-gray-500">
                {t("dashboard.subtitle")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <button
                onClick={() => fetchAll(true)}
                disabled={loading}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("dashboard.refreshing") : t("common.refresh")}
              </button>
            </div>
          </div>

          {/* Error State */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-500 font-medium mb-3">{error}</p>
              <button
                onClick={() => fetchAll()}
                className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {data.stats.map((stat) => (
                  <StatCard key={stat.title} {...stat} />
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <SalesOverviewChart data={data.salesData} />
                <TopProductsList 
                  products={data.topProducts} 
                  onViewAll={() => navigate("/dashboard/products")} 
                />
              </div>

              {/* Orders + Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <RecentOrdersTable orders={recentOrders} />
                <OrderStatusDonut 
                  data={data.statusBreakdown} 
                  onViewAll={() => navigate("/dashboard/orders")} 
                />
              </div>
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}