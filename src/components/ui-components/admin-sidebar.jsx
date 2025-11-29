"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout(); // ❗ CLEAR ZUSTAND STORE (Important)

    toast.success("Logged out", {
      description: "You have been successfully logged out.",
    });

    router.push("/admin/login");
  };

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "users", label: "Users", icon: Users, href: "/admin/users" },
    { id: "sellers", label: "Seller Verification", icon: UserCheck, href: "/admin/sellers" },
    { id: "products", label: "Products", icon: ShoppingBag, href: "/admin/products" },
    { id: "orders", label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r min-h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-primary">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Marketplace Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  isActive
                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
