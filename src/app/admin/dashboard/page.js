"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/ui-components/admin-sidebar";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Users, UserCheck, ShoppingBag, BarChart2, DollarSign } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUserStore } from "@/store/user-store";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) return;
    loadDashboard();
  }, [token]);

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8989/aimdev/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data.data.data);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="p-10 text-xl">Loading session...</div>;
  if (loading || !data) return <div className="p-10 text-xl">Loading Dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab="dashboard" />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6 text-primary">Dashboard</h1>

        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          <MetricCard
            icon={<Users className="h-5 w-5 text-primary" />}
            title="Total Users"
            value={data.totalUsers}
          />
          <MetricCard
            icon={<UserCheck className="h-5 w-5 text-primary" />}
            title="Total Sellers"
            value={data.totalSellers}
          />
          <MetricCard
            icon={<ShoppingBag className="h-5 w-5 text-primary" />}
            title="Total Products"
            value={data.totalProducts}
          />
          <MetricCard
            icon={<BarChart2 className="h-5 w-5 text-primary" />}
            title="Total Orders"
            value={data.totalOrders}
          />
          <MetricCard
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            title="Total Revenue"
            value={`₹${data.totalRevenue}`}
          />
        </div>

        {/* OVERVIEW */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Overview</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={Object.entries(data.revenueTrends).map(([month, value]) => ({
                      month,
                      value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#d64572" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Order Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Order Distribution</CardTitle>
              <CardDescription>Delivered / Shipped / Initial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(data.orderDistribution).map(
                      ([status, count]) => ({ status, count })
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#e76f7c" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT USERS */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Recent Users</h2>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-pink-100">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* RECENT SELLERS */}
        <h2 className="text-xl font-semibold mt-10 mb-4">Recent Sellers</h2>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-pink-100">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sellers.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.fullName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          s.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {s.verified ? "Verified" : "Pending"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-row justify-between items-center">
        <p className="text-sm text-gray-600">{title}</p>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
