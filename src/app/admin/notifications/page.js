"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/ui-components/admin-sidebar";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { 
  Bell, 
  UserPlus, 
  Package, 
  PackagePlus,
  Clock,
  Check,
  Trash2,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = useUserStore((state) => state.token);

  useEffect(() => {
    if (!token) return;
    loadNotifications();
  }, [token]);

  const loadNotifications = async () => {
    try {
      const mockNotifications = [
        {
          id: "1",
          type: "SELLER_REGISTRATION",
          title: "New Seller Registration",
          message: "Vikram Traders has registered as a new seller",
          sellerName: "Vikram Traders",
          sellerEmail: "vikram@traders.com",
          isRead: false,
          createdAt: "2025-12-08T10:30:00",
        },
        {
          id: "2",
          type: "PRODUCT_ADDED",
          title: "New Product Added",
          message: "Sita Enterprises added a new product: Cotton Saree",
          sellerName: "Sita Enterprises",
          productName: "Cotton Saree",
          isRead: false,
          createdAt: "2025-12-08T09:15:00",
        },
        {
          id: "3",
          type: "PRODUCT_UPDATED",
          title: "Product Updated",
          message: "Kumar Store updated product: Leather Wallet",
          sellerName: "Kumar Store",
          productName: "Leather Wallet",
          isRead: true,
          createdAt: "2025-12-07T16:45:00",
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 800));
      setNotifications(mockNotifications);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SELLER_REGISTRATION":
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case "PRODUCT_ADDED":
        return <PackagePlus className="h-5 w-5 text-green-600" />;
      case "PRODUCT_UPDATED":
        return <Package className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.isRead;
    if (filter === "read") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!token) return <div className="p-10 text-xl">Loading session...</div>;
  if (loading) return <div className="p-10 text-xl">Loading Notifications...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">
              Stay updated with seller activities and product changes
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link href="/admin/send-notification">
              <Button className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </Link>
            
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Read</p>
                  <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
            All
          </Button>
          <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")} size="sm">
            Unread ({unreadCount})
          </Button>
          <Button variant={filter === "read" ? "default" : "outline"} onClick={() => setFilter("read")} size="sm">
            Read
          </Button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No notifications found</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card key={notif.id} className={!notif.isRead ? "bg-blue-50/50 border-blue-200" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm">{notif.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {notif.sellerName && (
                              <Badge variant="secondary" className="text-xs">{notif.sellerName}</Badge>
                            )}
                            {notif.productName && (
                              <Badge variant="outline" className="text-xs">{notif.productName}</Badge>
                            )}
                          </div>
                        </div>
                        {!notif.isRead && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500">
                          {new Date(notif.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                        <div className="flex gap-2">
                          {!notif.isRead && (
                            <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Mark as read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notif.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}


