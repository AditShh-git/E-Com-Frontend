"use client";

import { useState } from "react";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Bar,
  BarChart,
  YAxis,
  Tooltip,
} from "recharts";

const adoptionData = [
  { day: "Mon", pets: 40 },
  { day: "Tue", pets: 35 },
  { day: "Wed", pets: 45 },
  { day: "Thu", pets: 30 },
  { day: "Fri", pets: 60 },
  { day: "Sat", pets: 20 },
  { day: "Sun", pets: 25 },
];

const breedData = [
  { name: "Labrador", count: 90 },
  { name: "Poodle", count: 75 },
  { name: "Golden Retriever", count: 100 },
  { name: "Bulldog", count: 85 },
  { name: "Beagle", count: 60 },
];

const salesData = [
  { month: "Jan", sales: 5000 },
  { month: "Feb", sales: 8000 },
  { month: "Mar", sales: 6000 },
  { month: "Apr", sales: 9000 },
  { month: "May", sales: 4000 },
  { month: "Jun", sales: 7000 },
  { month: "Jul", sales: 0 },
  { month: "Aug", sales: 11000 },
  { month: "Sep", sales: 3000 },
  { month: "Oct", sales: 6500 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 0 },
];

const sellers = [
  { name: "Seller A", sales: "$10,000", rating: 90 },
  { name: "Seller B", sales: "$8,000", rating: 85 },
  { name: "Seller C", sales: "$6,000", rating: 80 },
  { name: "Seller D", sales: "$4,000", rating: 75 },
  { name: "Seller E", sales: "$2,000", rating: 70 },
];

const signupData = [
  { week: "Week 1", users: 200 },
  { week: "Week 2", users: 130 },
  { week: "Week 3", users: 170 },
  { week: "Week 4", users: 220 },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
          <p className="text-muted-foreground">View analytics data & reports</p>
        </header>

        <div className="min-h-screen bg-[#fef6ef] dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-6">Analytics</h1>

          {/* Product Sales */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Product Sales</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-1">
                Product Sales Over Time
              </h3>
              <p className="text-4xl font-bold">$50,000</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This Year{" "}
                <span className="text-green-600 font-semibold">+20%</span>
              </p>
            </div>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: "#4B5563", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderRadius: "10px",
                      color: "#fff",
                      border: "none",
                    }}
                    labelStyle={{ color: "#D1D5DB" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#000"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Seller Performance */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Seller Performance</h2>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-4 text-lg">Seller</th>
                    <th className="px-6 py-4 text-lg">Sales</th>
                    <th className="px-6 py-4 text-lg">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sellers.map((seller, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 dark:border-gray-600"
                    >
                      <td className="px-6 py-4 text-base">{seller.name}</td>
                      <td className="px-6 py-4 text-base">{seller.sales}</td>
                      <td className="px-6 py-4 text-base">
                        <div className="flex items-center gap-2">
                          <div className="w-28 bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 bg-black dark:bg-white rounded-full"
                              style={{ width: `${seller.rating}%` }}
                            ></div>
                          </div>
                          <span>{seller.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {sellers.map((seller, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4"
                >
                  <h3 className="text-lg font-semibold mb-2">{seller.name}</h3>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Sales:</span> {seller.sales}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Rating:</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-black dark:bg-white rounded-full"
                          style={{ width: `${seller.rating}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm">{seller.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New User Signups */}
          <section className="mb-10">
            <h2 className="font-semibold text-2xl mt-6 mb-4">New User Signups</h2>
            <div className="border border-gray-400 p-4 rounded-xl shadow bg-white">
              <p className="text-base text-black mb-2">New Signups</p>
              <p className="text-2xl font-bold">500</p>
              <p className="text-base text-gray-500">
                This Month{" "}
                <span className="text-green-500 font-medium">+5%</span>
              </p>
              <div className="max-w-md w-full ml-0">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={signupData}  barCategoryGap="5%" barGap={0}>
                    <XAxis
                      dataKey="week"
                      axisLine={{ stroke: "#ccc" }}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="users"
                      fill="#991b1b"
                      radius={[6, 6, 0, 0]}
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
