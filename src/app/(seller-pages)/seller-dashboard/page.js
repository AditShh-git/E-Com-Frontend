"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import {
  BarChart3,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Bell,
  DollarSign,
  Star,
  Settings,
  MessageCircle,
  Archive,
  LogOut
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import Overview from "./overview";
import Products from "./products";
import Orders from "./orders";
import Customers from "./customers";
import Analytics from "./analytics";
import Notifications from "./notifications";

/* ================= BACKEND COMMENTED (UNCHANGED) ================= */
// import { useSellerStore } from "@/store/seller-store";
// import { getSellerProfile } from "@/utils/sellerApi";
/* ================================================================ */

export default function SellerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(urlTab);

  const [seller, setSeller] = useState({
    userName: "Sophia Carter",
    email: "seller@example.com",
    sellerId: "123456",
    imageUrl: "/placeholder.svg",
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setActiveTab(urlTab), [urlTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/seller-dashboard?tab=${tab}`);
  };

  const getSellerImage = () => {
    return seller?.imageUrl || "/placeholder.svg";
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* ===================== SIDEBAR ===================== */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">

        {/* TOP PROFILE */}
        <div>
          <div className="flex items-center gap-3 px-5 py-6 border-b">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border">
              <Image src={getSellerImage()} alt="Seller" fill className="object-cover" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold">{seller.userName}</div>
              <div className="text-xs text-muted-foreground">
                Seller ID: {seller.sellerId}
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="px-4 py-4 space-y-1">

            {[
              { id: "overview", label: "Dashboard", icon: BarChart3 },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "inventory", label: "Inventory", icon: Archive },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
              { id: "notifications", label: "Notifications", icon: Bell }, // ✅ KEPT AS EARLIER
              { id: "messages", label: "Messages", icon: MessageCircle },
              { id: "payments", label: "Payments", icon: DollarSign },
              { id: "coupons", label: "Coupons", icon: DollarSign },
              { id: "reviews", label: "Reviews", icon: Star },
              { id: "settings", label: "Store Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-full text-sm transition
                    ${isActive
                      ? "bg-rose-700 text-white"
                      : "text-gray-700 hover:bg-muted"}
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}

          </nav>
        </div>

        {/* LOGOUT BUTTON (BOTTOM FIXED) */}
        <div className="p-4 border-t">
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => {
              // ✅ BACKEND LOGOUT CAN BE ADDED LATER
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="flex-1">

        {/* TOP BAR */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h2 className="font-bold text-xl text-primary">Seller Dashboard</h2>

          <div className="flex items-center gap-4">
            <Input placeholder="Search..." className="w-64" />
            <div className="relative w-9 h-9 rounded-full overflow-hidden border">
              <Image src={getSellerImage()} fill className="object-cover" />
            </div>
          </div>
        </header>

        {/* ===================== TAB CONTENT ===================== */}
        <main className="p-6">
          <Tabs value={activeTab}>

            <TabsContent value="overview">
              <Overview setActiveTab={handleTabChange} />
            </TabsContent>

            <TabsContent value="products">
              <Products />
            </TabsContent>

            <TabsContent value="orders">
              <Orders />
            </TabsContent>

            <TabsContent value="customers">
              <Customers />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>

            {/* ✅ KEPT NOTIFICATIONS */}
            <TabsContent value="notifications">
              <Notifications />
            </TabsContent>

            {/* ✅ FUTURE TABS */}
            <TabsContent value="inventory">Inventory Page</TabsContent>
            <TabsContent value="messages">Messages Page</TabsContent>
            <TabsContent value="payments">Payments Page</TabsContent>
            <TabsContent value="coupons">Coupons Page</TabsContent>
            <TabsContent value="reviews">Reviews Page</TabsContent>
            <TabsContent value="settings">Store Settings Page</TabsContent>

          </Tabs>
        </main>
      </div>
    </div>
  );
}






// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// import Link from "next/link";
// import Image from "next/image";

// import {
//   BarChart3,
//   ShoppingBag,
//   Users,
//   Package,
//   Search,
//   TrendingUp,
//   Bell,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent } from "@/components/ui/tabs";

// import Overview from "./overview";
// import Products from "./products";
// import Orders from "./orders";
// import Customers from "./customers";
// import Analytics from "./analytics";
// import Notifications from "./notifications";

// // import { useSellerStore } from "@/store/seller-store";
// // import { getSellerProfile } from "@/utils/sellerApi";

// export default function SellerDashboard() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const urlTab = searchParams.get("tab") || "overview";
//   const [activeTab, setActiveTab] = useState(urlTab);

//   // ========== BACKEND CONNECTION COMMENTED ==========
//   // Zustand store
//   // const seller = useSellerStore((s) => s.seller);
//   // const setSeller = useSellerStore((s) => s.setSeller);
//   // ========== END BACKEND CONNECTION ==========

//   // Mock seller data for frontend
//   const [seller, setSeller] = useState({
//     userName: "John Seller",
//     email: "seller@example.com",
//     sellerId: "SELL12345",
//     imageUrl: "/placeholder.svg"
//   });

//   const [isMounted, setIsMounted] = useState(false);

//   // Avoid hydration mismatch
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // ========== BACKEND CONNECTION COMMENTED ==========
//   // Fetch latest seller data
//   /*
//   useEffect(() => {
//     if (!isMounted) return;

//     async function loadSeller() {
//       try {
//         const res = await getSellerProfile();
//         console.log("Seller /me:", res);

//         if (!res || res.status !== "SUCCESS") {
//           console.warn("Invalid /me response:", res);
//           return;
//         }

//         // ✔ Store only the real seller object
//         setSeller(res.data.seller);

//       } catch (err) {
//         console.error("Failed to load seller:", err);
//       }
//     }

//     loadSeller();
//   }, [isMounted, setSeller]);
//   */
//   // ========== END BACKEND CONNECTION ==========

//   // Sync tab
//   useEffect(() => {
//     setActiveTab(urlTab);
//   }, [urlTab]);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     router.push(`/seller-dashboard?tab=${tab}`);
//   };

//   // Build seller image URL
//   const getSellerImage = () => {
//     // ========== BACKEND CONNECTION COMMENTED ==========
//     /*
//     const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
//     const img =
//       seller?.imageUrl ||
//       seller?.profileImage ||
//       seller?.image ||
//       "";

    // if (!img) return "/placeholder.svg";

//     const fixed = img.replace(
//       "/api/files/private",
//       "/aimdev/api/files/public"
//     );

//     if (fixed.startsWith("http")) return fixed;
//     if (fixed.startsWith("/")) return backend + fixed;

//     return `${backend}/${fixed}`;
//     */
//     // ========== END BACKEND CONNECTION ==========

//     // Frontend-only: return mock image
//     return seller?.imageUrl || "/placeholder.svg";
//   };

//   if (!isMounted) return null;

//   return (
//     <div className="flex min-h-screen bg-muted/30">

//       {/* ============================= */}
//       {/* SIDEBAR */}
//       {/* ============================= */}
//       <div className="hidden md:flex flex-col w-64 bg-white border-r">
//         <div className="p-4 border-b">
//           <h2 className="font-bold text-xl text-primary">Seller Dashboard</h2>
//         </div>

//         <nav className="flex-1 p-4 space-y-1">

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "overview" ? "bg-primary/10 text-primary" : ""
//             }`}
//             onClick={() => handleTabChange("overview")}
//           >
//             <BarChart3 className="h-5 w-5 mr-3" />
//             Overview
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "products" ? "bg-muted" : ""
//             }`}
//             onClick={() => handleTabChange("products")}
//           >
//             <Package className="h-5 w-5 mr-3" />
//             Products
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "orders" ? "bg-muted" : ""
//             }`}
//             onClick={() => handleTabChange("orders")}
//           >
//             <ShoppingBag className="h-5 w-5 mr-3" />
//             Orders
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "customers" ? "bg-muted" : ""
//             }`}
//             onClick={() => handleTabChange("customers")}
//           >
//             <Users className="h-5 w-5 mr-3" />
//             Customers
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "notifications" ? "bg-muted" : ""
//             }`}
//             onClick={() => handleTabChange("notifications")}
//           >
//             <Bell className="h-5 w-5 mr-3" />
//             Notifications
//           </Button>

//           <Button
//             variant="ghost"
//             className={`w-full justify-start ${
//               activeTab === "analytics" ? "bg-muted" : ""
//             }`}
//             onClick={() => handleTabChange("analytics")}
//           >
//             <TrendingUp className="h-5 w-5 mr-3" />
//             Analytics
//           </Button>

//         </nav>
//       </div>

//       {/* ============================= */}
//       {/* MAIN CONTENT */}
//       {/* ============================= */}
//       <div className="flex-1">
//         <header className="bg-white border-b p-4 flex items-center justify-between">
//           <h2 className="md:hidden font-bold text-xl text-primary">
//             Seller Dashboard
//           </h2>

//           <div className="flex items-center ml-auto">

//             {/* Search bar */}
//             <div className="relative mr-4">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search..."
//                 className="w-[200px] md:w-[300px] pl-8"
//               />
//             </div>

//             <Button variant="outline" size="sm" className="mr-3">
//               <Link href="/messages">Messages</Link>
//             </Button>

//             {/* SELLER PROFILE INFO */}
//             <div className="flex items-center gap-3">

//               {/* Profile Image */}
//               <div className="relative w-10 h-10 rounded-full overflow-hidden border">
//                 <Image
//                   src={getSellerImage()}
//                   alt="Seller Profile"
//                   fill
//                   className="object-cover"
//                 />
//               </div>

//               {/* Username + Email + SellerID */}
//               <div className="hidden md:flex flex-col leading-tight text-right">
//                 <span className="font-semibold">{seller?.userName}</span>
//                 <span className="text-xs text-gray-500">{seller?.email}</span>

//                 <span className="px-2 mt-1 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-md inline-block">
//                   {seller?.sellerId}
//                 </span>
//               </div>

//             </div>
//           </div>
//         </header>

//         {/* ============================= */}
//         {/* TAB CONTENT */}
//         {/* ============================= */}
//         <main className="p-6">
//           <Tabs value={activeTab}>
//             <TabsContent value="overview">
//               <Overview setActiveTab={handleTabChange} />
//             </TabsContent>

//             <TabsContent value="products">
//               <Products />
//             </TabsContent>

//             <TabsContent value="orders">
//               <Orders />
//             </TabsContent>

//             <TabsContent value="customers">
//               <Customers />
//             </TabsContent>

//             <TabsContent value="notifications">
//               <Notifications />
//             </TabsContent>

//             <TabsContent value="analytics">
//               <Analytics />
//             </TabsContent>
//           </Tabs>
//         </main>

//       </div>
//     </div>
//   );
// }


