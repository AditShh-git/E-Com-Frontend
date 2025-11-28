"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

import {
  getSellerAnalyticsOverview,
  getSellerSalesTrend,
  getSellerTopProducts
} from "@/utils/sellerApi";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const overviewRes = await getSellerAnalyticsOverview();
      const salesRes = await getSellerSalesTrend();
      const productsRes = await getSellerTopProducts();

      console.log("RAW Overview:", overviewRes);
      console.log("RAW Sales:", salesRes);
      console.log("RAW Products:", productsRes);

      // ===== Extract BACKEND data correctly =====
      const overview = overviewRes?.data?.data || {};

      // ===============================
      //     TOP CARDS CALCULATIONS
      // ===============================

      const totalSales = (overview.salesTrend || []).reduce(
        (sum, item) => sum + (item.sales || 0),
        0
      );

      const totalOrders = (overview.orderStatus || []).reduce(
        (sum, item) => sum + (item.value || 0),
        0
      );

      const customerAcquisition = (overview.recentOrdersActivity || []).reduce(
        (sum, item) => sum + (item.orders || 0),
        0
      );

      // ===============================
      //     CHART MAPPING
      // ===============================

      const mappedSalesTrend = (overview.salesTrend || []).map((item) => ({
        day: item.day,
        revenue: item.sales,
      }));

      const mappedTopProducts = (overview.topProducts || []).map((item) => ({
        product: item.name,
        quantity: item.units,
      }));

      setAnalytics({
        totalSales,
        totalOrders,
        customerAcquisition,
        salesTrend: mappedSalesTrend,
        topProducts: mappedTopProducts,
      });

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Loading analytics…</p>;
  if (!analytics) return <p className="p-4">Failed to load analytics.</p>;

  const salesTrend = analytics.salesTrend ?? [];
  const topProducts = analytics.topProducts ?? [];

  return (
    <TabsContent value="analytics" className="space-y-6">

      {/* ======================= */}
      {/*    TOP SUMMARY CARDS   */}
      {/* ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        <Card>
          <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{analytics.totalSales || 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">
            {analytics.totalOrders || 0}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer Acquisition</CardTitle></CardHeader>
          <CardContent className="text-2xl font-bold">
            {analytics.customerAcquisition || 0}
          </CardContent>
        </Card>
      </div>

      {/* ======================= */}
      {/*      SALES TREND       */}
      {/* ======================= */}
      <Card>
        <CardHeader><CardTitle>Sales Trend</CardTitle></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ======================= */}
      {/*    TOP SELLING ITEMS    */}
      {/* ======================= */}
      <Card>
        <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topProducts}>
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#991b1b" barSize={55} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </TabsContent>
  );
}
