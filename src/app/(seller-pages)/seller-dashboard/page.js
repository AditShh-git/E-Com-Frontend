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

// ------------------------------
// READ SELLER NAME
// ------------------------------
let username = "";
const loginSellerDetails =
  typeof window !== "undefined"
    ? localStorage.getItem("user-storage")
    : null;

if (loginSellerDetails) {
  try {
    const parsed = JSON.parse(loginSellerDetails);
    username = parsed?.state?.user?.username || "";
  } catch {}
}

export default function SellerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read tab from URL
  const urlTab = searchParams.get("tab") || "overview";

  const [activeTab, setActiveTab] = useState(urlTab);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync tab UI when URL changes
  useEffect(() => {
    setActiveTab(urlTab);
  }, [urlTab]);

  // Change URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`/seller-dashboard?tab=${tab}`);
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">

      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h2 className="md:hidden font-bold text-xl text-primary">
            Seller Dashboard
          </h2>

          <div className="flex items-center ml-auto">
            <div className="relative mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[300px] pl-8"
              />
            </div>

            <Button variant="outline" size="sm" className="mr-2">
              <Link href="/messages">Messages</Link>
            </Button>

            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="hidden md:inline font-medium">{username}</span>
            </div>
          </div>
        </header>

        {/* TAB CONTENT */}
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
