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

/* ============================
   ❌ BACKEND CONNECTION OFF
============================ */
// import { getSellerOverview } from "@/utils/sellerApi";

export default function Overview() {
  const [overview, setOverview] = useState(null);

  /* ============================
     ✅ FRONTEND MOCK DATA
  ============================ */
  useEffect(() => {
    setOverview({
      stats: {
        totalSales: 12500,
        orders: 350,
        avgOrderValue: 35.71,
      },
      recentOrders: [
        { id: "#1001", customer: "Liam Harper", date: "2023-08-15", status: "Shipped", total: "$45.00" },
        { id: "#1002", customer: "Olivia Bennett", date: "2023-08-14", status: "Delivered", total: "$60.00" },
        { id: "#1003", customer: "Noah Foster", date: "2023-08-13", status: "Processing", total: "$30.00" },
        { id: "#1004", customer: "Emma Hayes", date: "2023-08-12", status: "Shipped", total: "$75.00" },
        { id: "#1005", customer: "Lucas Reed", date: "2023-08-11", status: "Delivered", total: "$50.00" },
      ],
      products: [
        { name: "Product A", value: 80 },
        { name: "Product B", value: 75 },
        { name: "Product C", value: 70 },
        { name: "Product D", value: 72 },
        { name: "Product E", value: 68 },
      ],
    });
  }, []);

  if (!overview) return <p className="p-6">Loading dashboard...</p>;

  return (
    <TabsContent value="overview" className="space-y-8">

      {/* ===================== */}
      {/*      STAT CARDS       */}
      {/* ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <div className="text-2xl font-bold">${overview.stats.totalSales}</div>
            <span className="text-green-600 text-sm">+12%</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Orders</p>
            <div className="text-2xl font-bold">{overview.stats.orders}</div>
            <span className="text-green-600 text-sm">+8%</span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Average Order Value</p>
            <div className="text-2xl font-bold">
              ${overview.stats.avgOrderValue}
            </div>
            <span className="text-red-600 text-sm">-3%</span>
          </CardContent>
        </Card>

      </div>

      {/* ===================== */}
      {/*    RECENT ORDERS     */}
      {/* ===================== */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-rose-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {overview.recentOrders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs">
                      {o.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{o.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/*  PRODUCT PERFORMANCE */}
      {/* ===================== */}
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-1">
            Sales by Product
          </p>
          <p className="text-xl font-bold mb-4">$12,500</p>
          <p className="text-green-600 text-sm mb-6">Last 30 Days +12%</p>

          <div className="flex items-end gap-6 h-40">
            {overview.products.map((p) => (
              <div key={p.name} className="flex flex-col items-center">
                <div
                  className="w-10 rounded bg-gradient-to-t from-black to-red-500"
                  style={{ height: `${p.value * 1.5}px` }}
                />
                <span className="text-xs mt-2">{p.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </TabsContent>
  );
}






// "use client";

// import { useEffect, useState } from "react";
// import { DollarSign, ShoppingBag, Package, Star } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { TabsContent } from "@/components/ui/tabs";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { getSellerOverview } from "@/utils/sellerApi";

// export default function Overview() {
//   const [loading, setLoading] = useState(true);
//   const [overview, setOverview] = useState(null);

//   useEffect(() => {
//     async function load() {
//       const res = await getSellerOverview();

//       //  FIXED → REAL DATA INSIDE res.data.data.data
//       const payload =
//         res?.data?.data?.data ||
//         res?.data?.data ||
//         res?.data ||
//         null;

//       setOverview(payload);
//       setLoading(false);
//     }

//     load();
//   }, []);

//   if (loading) return <p className="p-4">Loading overview…</p>;
//   if (!overview) return <p className="p-4">Failed to load seller overview.</p>;

//   // ⭐ SAFE FALLBACKS
//   const stats = overview.stats || {};
//   const recent = overview.recentOrders || [];
//   const topProducts = overview.topProducts || [];

//   return (
//     <TabsContent value="overview" className="space-y-6">

//       {/* ======================= */}
//       {/*       STAT CARDS        */}
//       {/* ======================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

//         <Card>
//           <CardHeader className="flex justify-between">
//             <CardTitle>Total Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹{stats.totalRevenue ?? 0}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex justify-between">
//             <CardTitle>Total Orders</CardTitle>
//             <ShoppingBag className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalOrders ?? 0}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex justify-between">
//             <CardTitle>Total Products</CardTitle>
//             <Package className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.totalProducts ?? 0}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex justify-between">
//             <CardTitle>Rating</CardTitle>
//             <Star className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {stats.averageRating ?? 0}/5
//             </div>
//           </CardContent>
//         </Card>

//       </div>

//       {/* ======================= */}
//       {/*     RECENT ORDERS       */}
//       {/* ======================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Orders</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead className="text-right">Amount</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {recent.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center py-4">
//                     No recent orders
//                   </TableCell>
//                 </TableRow>
//               )}

//               {recent.map((o) => (
//                 <TableRow key={o.orderId}>
//                   <TableCell>{o.orderId}</TableCell>
//                   <TableCell>{o.customerName}</TableCell>
//                   <TableCell>{o.status}</TableCell>
//                   <TableCell className="text-right">₹{o.total}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>

//           </Table>
//         </CardContent>
//       </Card>

//       {/* ======================= */}
//       {/*      TOP PRODUCTS       */}
//       {/* ======================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Top Selling Products</CardTitle>
//         </CardHeader>

//         <CardContent>
//           {topProducts.length === 0 && <p>No top products yet.</p>}

//           {topProducts.map((p, idx) => (
//             <div key={idx} className="flex justify-between py-2 border-b">
//               <p className="font-medium">{p.name}</p>
//               <span className="font-bold">{p.units} sold</span>
//             </div>
//           ))}
//         </CardContent>
//       </Card>

//     </TabsContent>
//   );
// }
