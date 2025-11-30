"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getSellerOverview } from "@/utils/sellerApi";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await getSellerOverview();

      //  FIXED → REAL DATA INSIDE res.data.data.data
      const payload =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data ||
        null;

      setOverview(payload);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="p-4">Loading overview…</p>;
  if (!overview) return <p className="p-4">Failed to load seller overview.</p>;

  // ⭐ SAFE FALLBACKS
  const stats = overview.stats || {};
  const recent = overview.recentOrders || [];
  const topProducts = overview.topProducts || [];

  return (
    <TabsContent value="overview" className="space-y-6">

      {/* ======================= */}
      {/*       STAT CARDS        */}
      {/* ======================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Rating</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating ?? 0}/5
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ======================= */}
      {/*     RECENT ORDERS       */}
      {/* ======================= */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No recent orders
                  </TableCell>
                </TableRow>
              )}

              {recent.map((o) => (
                <TableRow key={o.orderId}>
                  <TableCell>{o.orderId}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{o.status}</TableCell>
                  <TableCell className="text-right">₹{o.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* ======================= */}
      {/*      TOP PRODUCTS       */}
      {/* ======================= */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>

        <CardContent>
          {topProducts.length === 0 && <p>No top products yet.</p>}

          {topProducts.map((p, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <p className="font-medium">{p.name}</p>
              <span className="font-bold">{p.units} sold</span>
            </div>
          ))}
        </CardContent>
      </Card>

    </TabsContent>
  );
}
