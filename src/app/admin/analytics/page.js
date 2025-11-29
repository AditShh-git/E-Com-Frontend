"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);

  const [overview, setOverview] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [salesPerformance, setSalesPerformance] = useState(null);
  const [salesTable, setSalesTable] = useState([]);

  const router = useRouter();

  const token = useUserStore((s) => s.token);
  const role = useUserStore((s) => s.role);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);

  // -------- PROTECT ROUTE -------
  useEffect(() => {
    if (!isLoggedIn || role !== "ADMIN") {
      router.push("/admin/login");
    }
  }, [isLoggedIn, role]);

  useEffect(() => {
    if (token) {
      fetchAnalyticsDashboard();
    }
  }, [token]);

  const fetchAnalyticsDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8989/aimdev/api/admin/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data?.data?.data;

      setOverview(data.summary);
      setSalesPerformance(data.salesPerformance);
      setUserActivity(data.userActivity);
      setSalesTable(data.salesTable);
    } catch (err) {
      console.error("Analytics API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">Analytics & Reporting</h1>
          <p className="text-muted-foreground">Store performance overview</p>
        </header>

        <div className="p-4 sm:p-6 md:p-10 bg-[#fef6ef] min-h-screen">
          {/* TOP METRICS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
            <MetricCard label="Total Revenue" value={`$${overview.totalRevenue}`} />
            <MetricCard label="Sales Trends" value={`${overview.salesTrendPercent}%`} />
            <MetricCard label="User Growth" value={`${overview.newUsers} new users`} />
            <MetricCard label="Order Volume" value={`${overview.orderVolume} orders`} />
            <MetricCard label="Top Selling Product" value={overview.topSellingProduct} />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Sales Performance */}
            <div className="bg-white rounded-xl shadow p-6 border">
              <h2 className="text-xl font-semibold mb-2">Sales Performance</h2>
              <p className="text-3xl font-bold">${salesPerformance.totalSalesLast30Days}</p>
              <p className="text-gray-500 mb-4">
                Last 30 days{" "}
                <span className="text-green-600">+{salesPerformance.percentChange}%</span>
              </p>

              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesPerformance.weeklyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekLabel" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#991b1b"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Activity */}
            <div className="bg-white rounded-xl shadow p-6 border">
              <h2 className="text-xl font-semibold mb-2">User Activity</h2>
              <p className="text-3xl font-bold">{userActivity.totalActiveUsers}</p>
              <p className="text-gray-500 mb-4">
                Last 30 days{" "}
                <span className="text-green-600">+{userActivity.percentChange}%</span>
              </p>

              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivity.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekLabel" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="userCount" fill="#dd5182" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SALES PERFORMANCE TABLE */}
          <div className="bg-white rounded-xl shadow p-6 border mb-10">
            <h2 className="text-xl font-semibold mb-4">Sales Performance Report</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Seller</th>
                    <th className="text-left p-3">Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {salesTable.map((row, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-3">{row.product}</td>
                      <td className="p-3">{row.category}</td>
                      <td className="p-3">{row.seller}</td>
                      <td className="p-3 font-semibold">${row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl border p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
