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
  Search,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import Overview from "./overview";
import Products from "./products";
import Orders from "./orders";
import Customers from "./customers";
import Analytics from "./analytics";

import { useSellerStore } from "@/store/seller-store";
import { getSellerProfile } from "@/utils/sellerApi";

export default function SellerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(urlTab);

  // Zustand store
  const seller = useSellerStore((s) => s.seller);
  const setSeller = useSellerStore((s) => s.setSeller);

  const [isMounted, setIsMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch latest seller data
  useEffect(() => {
    if (!isMounted) return;

    async function loadSeller() {
      try {
        const res = await getSellerProfile();
        console.log("Seller /me:", res);

        if (!res || res.status !== "SUCCESS") {
          console.warn("Invalid /me response:", res);
          return;
        }

        // ✔ Store only the real seller object
        setSeller(res.data.seller);

      } catch (err) {
        console.error("Failed to load seller:", err);
      }
    }

    loadSeller();
  }, [isMounted, setSeller]);

  // Sync tab
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/seller-dashboard?tab=${tab}`);
  };

  // Build seller image URL
  const getSellerImage = () => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const img =
      seller?.imageUrl ||
      seller?.profileImage ||
      seller?.image ||
      "";

    if (!img) return "/placeholder.svg";

    const fixed = img.replace(
      "/api/files/private",
      "/aimdev/api/files/public"
    );

    if (fixed.startsWith("http")) return fixed;
    if (fixed.startsWith("/")) return backend + fixed;

    return `${backend}/${fixed}`;
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* ============================= */}
      {/* SIDEBAR */}
      {/* ============================= */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="font-bold text-xl text-primary">Seller Dashboard</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "overview" ? "bg-primary/10 text-primary" : ""
            }`}
            onClick={() => handleTabChange("overview")}
          >
            <BarChart3 className="h-5 w-5 mr-3" />
            Overview
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "products" ? "bg-muted" : ""
            }`}
            onClick={() => handleTabChange("products")}
          >
            <Package className="h-5 w-5 mr-3" />
            Products
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "orders" ? "bg-muted" : ""
            }`}
            onClick={() => handleTabChange("orders")}
          >
            <ShoppingBag className="h-5 w-5 mr-3" />
            Orders
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "customers" ? "bg-muted" : ""
            }`}
            onClick={() => handleTabChange("customers")}
          >
            <Users className="h-5 w-5 mr-3" />
            Customers
          </Button>

          <Button
            variant="ghost"
            className={`w-full justify-start ${
              activeTab === "analytics" ? "bg-muted" : ""
            }`}
            onClick={() => handleTabChange("analytics")}
          >
            <TrendingUp className="h-5 w-5 mr-3" />
            Analytics
          </Button>

        </nav>
      </div>

      {/* ============================= */}
      {/* MAIN CONTENT */}
      {/* ============================= */}
      <div className="flex-1">
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h2 className="md:hidden font-bold text-xl text-primary">
            Seller Dashboard
          </h2>

          <div className="flex items-center ml-auto">

            {/* Search bar */}
            <div className="relative mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[300px] pl-8"
              />
            </div>

            <Button variant="outline" size="sm" className="mr-3">
              <Link href="/messages">Messages</Link>
            </Button>

            {/* SELLER PROFILE INFO */}
            <div className="flex items-center gap-3">

              {/* Profile Image */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                <Image
                  src={getSellerImage()}
                  alt="Seller Profile"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Username + Email + SellerID */}
              <div className="hidden md:flex flex-col leading-tight text-right">
                <span className="font-semibold">{seller?.userName}</span>
                <span className="text-xs text-gray-500">{seller?.email}</span>

                <span className="px-2 mt-1 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-md inline-block">
                  {seller?.sellerId}
                </span>
              </div>

            </div>
          </div>
        </header>

        {/* ============================= */}
        {/* TAB CONTENT */}
        {/* ============================= */}
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
          </Tabs>
        </main>

      </div>
    </div>
  );
}
