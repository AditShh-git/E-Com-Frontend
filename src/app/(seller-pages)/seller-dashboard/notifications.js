"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  TrendingUp,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Notifications() {
  // ========== BACKEND CONNECTION COMMENTED ==========
  // const [notifications, setNotifications] = useState([]);
  // const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   async function fetchNotifications() {
  //     try {
  //       const res = await getSellerNotifications();
  //       if (res.status === "SUCCESS") {
  //         setNotifications(res.data.notifications);
  //       }
  //     } catch (err) {
  //       console.error("Failed to fetch notifications:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchNotifications();
  // }, []);
  // ========== END BACKEND CONNECTION ==========

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: "Order #ORD-2024-1234 has been placed by John Doe",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      type: "review",
      title: "New Product Review",
      message: "Your product 'Wireless Headphones' received a 5-star review",
      timestamp: "1 hour ago",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      type: "stock",
      title: "Low Stock Alert",
      message: "Product 'Gaming Mouse' has only 5 units remaining",
      timestamp: "3 hours ago",
      read: true,
      priority: "high",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment Received",
      message: "Payment of $1,250.00 has been credited to your account",
      timestamp: "5 hours ago",
      read: true,
      priority: "medium",
    },
    {
      id: 5,
      type: "message",
      title: "New Customer Message",
      message: "Customer Sarah Wilson sent you a message about Order #ORD-2024-1200",
      timestamp: "1 day ago",
      read: true,
      priority: "low",
    },
    {
      id: 6,
      type: "analytics",
      title: "Sales Milestone Reached",
      message: "Congratulations! You've reached 1,000 total sales",
      timestamp: "2 days ago",
      read: true,
      priority: "low",
    },
    {
      id: 7,
      type: "order",
      title: "Order Cancelled",
      message: "Order #ORD-2024-1180 has been cancelled by the customer",
      timestamp: "2 days ago",
      read: true,
      priority: "medium",
    },
    {
      id: 8,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance on Dec 15, 2024 from 2:00 AM - 4:00 AM",
      timestamp: "3 days ago",
      read: true,
      priority: "low",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />;
      case "stock":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "payment":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "analytics":
        return <TrendingUp className="h-5 w-5 text-indigo-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="default">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id) => {
    // ========== BACKEND CONNECTION COMMENTED ==========
    // async function updateNotification() {
    //   try {
    //     await markNotificationAsRead(id);
    //   } catch (err) {
    //     console.error("Failed to mark as read:", err);
    //   }
    // }
    // updateNotification();
    // ========== END BACKEND CONNECTION ==========

    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    // ========== BACKEND CONNECTION COMMENTED ==========
    // async function updateAllNotifications() {
    //   try {
    //     await markAllNotificationsAsRead();
    //   } catch (err) {
    //     console.error("Failed to mark all as read:", err);
    //   }
    // }
    // updateAllNotifications();
    // ========== END BACKEND CONNECTION ==========

    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    // ========== BACKEND CONNECTION COMMENTED ==========
    // async function removeNotification() {
    //   try {
    //     await deleteSellerNotification(id);
    //   } catch (err) {
    //     console.error("Failed to delete notification:", err);
    //   }
    // }
    // removeNotification();
    // ========== END BACKEND CONNECTION ==========

    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          <p className="text-muted-foreground mt-1">
            Stay updated with your seller activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {unreadCount} Unread
          </Badge>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <CardTitle className="text-lg">Filter Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="review">Reviews</SelectItem>
              <SelectItem value="stock">Stock Alerts</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="message">Messages</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                No notifications to display
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-all hover:shadow-md ${
                !notif.read ? "border-l-4 border-l-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-1">{getNotificationIcon(notif.type)}</div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{notif.title}</h3>
                          {!notif.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {notif.timestamp}
                          </span>
                          {getPriorityBadge(notif.priority)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notif.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notif.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
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
    </div>
  );
}