"use client";

import { useEffect, useState } from "react";
// import axios from "axios"; // ❌ Commented - no backend
import Link from "next/link";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { 
  Bell, 
  Tag, 
  Package, 
  Truck,
  CreditCard,
  Gift,
  Percent,
  ShoppingBag,
  AlertCircle,
  Star,
  Clock,
  Check,
  Trash2,
  Filter,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [typeFilter, setTypeFilter] = useState("all"); // all, orders, promotions, account

  const { token, isLoggedIn } = useUserStore();

  useEffect(() => {
    if (!token || !isLoggedIn) {
      window.location.href = "/signin";
      return;
    }
    loadNotifications();
  }, [token, isLoggedIn]);

  const loadNotifications = async () => {
    try {
      // ❌ Commented - Backend API call
      // const res = await axios.get(
      //   "http://localhost:8989/aimdev/api/notifications",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // setNotifications(res.data.data);

      // ✅ Frontend-only mock data
      const mockNotifications = [
        {
          id: "1",
          type: "SALE",
          title: "🎉 Mega Sale Alert!",
          message: "Get up to 70% OFF on Electronics! Limited time offer. Shop now and save big on your favorite gadgets.",
          actionUrl: "/categories/electronics",
          actionText: "Shop Now",
          isRead: false,
          priority: "high",
          createdAt: "2025-12-08T10:30:00",
        },
        {
          id: "2",
          type: "ORDER_SHIPPED",
          title: "Order Shipped",
          message: "Your order #ORD12345 has been shipped and is on the way! Expected delivery by Dec 10, 2025.",
          orderId: "ORD12345",
          actionUrl: "/account?tab=orders",
          actionText: "Track Order",
          isRead: false,
          priority: "medium",
          createdAt: "2025-12-08T09:15:00",
        },
        {
          id: "3",
          type: "PRICE_DROP",
          title: "Price Drop Alert!",
          message: "Great news! The item in your wishlist 'Wireless Headphones' is now available at ₹1,999 (was ₹2,999).",
          productName: "Wireless Headphones",
          actionUrl: "/wishlist",
          actionText: "View Product",
          isRead: false,
          priority: "medium",
          createdAt: "2025-12-08T08:00:00",
        },
        {
          id: "4",
          type: "ORDER_DELIVERED",
          title: "Order Delivered Successfully",
          message: "Your order #ORD12344 has been delivered. We hope you love your purchase!",
          orderId: "ORD12344",
          actionUrl: "/account?tab=orders",
          actionText: "Rate Product",
          isRead: true,
          priority: "low",
          createdAt: "2025-12-07T16:45:00",
        },
        {
          id: "5",
          type: "FLASH_SALE",
          title: "⚡ Flash Sale Starts in 1 Hour!",
          message: "Don't miss out! Flash sale on Fashion items starting at 12:00 PM. Up to 60% OFF!",
          actionUrl: "/categories/fashion",
          actionText: "Set Reminder",
          isRead: true,
          priority: "high",
          createdAt: "2025-12-07T14:30:00",
        },
        {
          id: "6",
          type: "BACK_IN_STOCK",
          title: "Back in Stock!",
          message: "Good news! 'Cotton Saree - Blue' from your wishlist is back in stock. Limited quantity available.",
          productName: "Cotton Saree - Blue",
          actionUrl: "/wishlist",
          actionText: "Buy Now",
          isRead: true,
          priority: "medium",
          createdAt: "2025-12-07T11:00:00",
        },
        {
          id: "7",
          type: "PAYMENT_SUCCESS",
          title: "Payment Successful",
          message: "Your payment of ₹3,450 for order #ORD12345 has been processed successfully.",
          orderId: "ORD12345",
          amount: "₹3,450",
          isRead: true,
          priority: "low",
          createdAt: "2025-12-07T10:15:00",
        },
        {
          id: "8",
          type: "REWARD_EARNED",
          title: "🎁 You've Earned Reward Points!",
          message: "Congratulations! You've earned 250 reward points on your recent purchase. Redeem now for exciting offers.",
          points: 250,
          actionUrl: "/account?tab=rewards",
          actionText: "View Rewards",
          isRead: true,
          priority: "low",
          createdAt: "2025-12-06T15:30:00",
        },
        {
          id: "9",
          type: "CART_REMINDER",
          title: "Items in Your Cart",
          message: "You have 3 items waiting in your cart. Complete your purchase before they're gone!",
          actionUrl: "/cart",
          actionText: "View Cart",
          isRead: true,
          priority: "low",
          createdAt: "2025-12-06T12:00:00",
        },
        {
          id: "10",
          type: "NEW_ARRIVAL",
          title: "New Arrivals Just for You!",
          message: "Check out the latest collection of Designer Kurtas. Perfect for the festive season!",
          actionUrl: "/products?filter=new-arrivals",
          actionText: "Explore",
          isRead: true,
          priority: "low",
          createdAt: "2025-12-05T18:00:00",
        },
        {
          id: "11",
          type: "ACCOUNT_SECURITY",
          title: "Security Alert",
          message: "New login detected from Chrome on Windows. If this wasn't you, please secure your account immediately.",
          actionUrl: "/account?tab=security",
          actionText: "Review Activity",
          isRead: true,
          priority: "high",
          createdAt: "2025-12-05T14:20:00",
        },
        {
          id: "12",
          type: "OFFER",
          title: "Exclusive Offer for You!",
          message: "Use code WELCOME100 and get ₹100 OFF on your next purchase above ₹999. Valid till Dec 15.",
          couponCode: "WELCOME100",
          actionUrl: "/products",
          actionText: "Shop Now",
          isRead: true,
          priority: "medium",
          createdAt: "2025-12-05T10:00:00",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setNotifications(mockNotifications);
    } catch (err) {
      console.error("Notifications Load Error:", err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // ❌ Commented - Backend API call
      // await axios.patch(
      //   `http://localhost:8989/aimdev/api/notifications/${id}/read`,
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // ✅ Frontend-only update
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      // ❌ Commented - Backend API call
      // await axios.patch(
      //   "http://localhost:8989/aimdev/api/notifications/read-all",
      //   {},
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // ✅ Frontend-only update
      setNotifications(
        notifications.map((notif) => ({ ...notif, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      // ❌ Commented - Backend API call
      // await axios.delete(
      //   `http://localhost:8989/aimdev/api/notifications/${id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // ✅ Frontend-only update
      setNotifications(notifications.filter((notif) => notif.id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  const deleteAllRead = async () => {
    try {
      // ❌ Commented - Backend API call
      // await axios.delete(
      //   "http://localhost:8989/aimdev/api/notifications/read",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      // ✅ Frontend-only update
      setNotifications(notifications.filter((notif) => !notif.isRead));
      toast.success("All read notifications deleted");
    } catch (err) {
      toast.error("Failed to delete notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "SALE":
      case "FLASH_SALE":
        return <Percent className="h-5 w-5 text-red-600" />;
      case "ORDER_SHIPPED":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "ORDER_DELIVERED":
        return <Package className="h-5 w-5 text-green-600" />;
      case "PRICE_DROP":
        return <Tag className="h-5 w-5 text-orange-600" />;
      case "PAYMENT_SUCCESS":
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case "REWARD_EARNED":
        return <Gift className="h-5 w-5 text-purple-600" />;
      case "BACK_IN_STOCK":
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case "CART_REMINDER":
        return <ShoppingBag className="h-5 w-5 text-yellow-600" />;
      case "NEW_ARRIVAL":
        return <Star className="h-5 w-5 text-pink-600" />;
      case "ACCOUNT_SECURITY":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "OFFER":
        return <Gift className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationCategory = (type) => {
    if (["ORDER_SHIPPED", "ORDER_DELIVERED", "PAYMENT_SUCCESS"].includes(type)) {
      return "orders";
    }
    if (["SALE", "FLASH_SALE", "PRICE_DROP", "OFFER", "NEW_ARRIVAL"].includes(type)) {
      return "promotions";
    }
    if (["ACCOUNT_SECURITY", "REWARD_EARNED"].includes(type)) {
      return "account";
    }
    return "other";
  };

  const filteredNotifications = notifications
    .filter((notif) => {
      if (filter === "unread") return !notif.isRead;
      if (filter === "read") return notif.isRead;
      return true;
    })
    .filter((notif) => {
      if (typeFilter === "all") return true;
      return getNotificationCategory(notif.type) === typeFilter;
    });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  if (!isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-600 mt-4">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Stay updated with your orders, offers, and account activity
            </p>
          </div>
          
          {unreadCount > 0 && (
            <Badge className="h-8 px-3 bg-primary text-white">
              {unreadCount} New
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        {(unreadCount > 0 || readCount > 0) && (
          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
            {readCount > 0 && (
              <Button onClick={deleteAllRead} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Read
              </Button>
            )}
          </div>
        )}

        {notifications.length > 0 ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                    </div>
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Unread</p>
                      <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Read</p>
                      <p className="text-2xl font-bold text-green-600">{readCount}</p>
                    </div>
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Section */}
            <Card className="bg-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by:</span>
                </div>
                
                {/* Read/Unread Filter */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    onClick={() => setFilter("unread")}
                    size="sm"
                  >
                    Unread ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === "read" ? "default" : "outline"}
                    onClick={() => setFilter("read")}
                    size="sm"
                  >
                    Read ({readCount})
                  </Button>
                </div>

                {/* Type Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={typeFilter === "all" ? "default" : "outline"}
                    onClick={() => setTypeFilter("all")}
                    size="sm"
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    All Types
                  </Button>
                  <Button
                    variant={typeFilter === "orders" ? "default" : "outline"}
                    onClick={() => setTypeFilter("orders")}
                    size="sm"
                  >
                    <Package className="h-3 w-3 mr-1" />
                    Orders
                  </Button>
                  <Button
                    variant={typeFilter === "promotions" ? "default" : "outline"}
                    onClick={() => setTypeFilter("promotions")}
                    size="sm"
                  >
                    <Percent className="h-3 w-3 mr-1" />
                    Promotions
                  </Button>
                  <Button
                    variant={typeFilter === "account" ? "default" : "outline"}
                    onClick={() => setTypeFilter("account")}
                    size="sm"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card className="bg-white">
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No notifications found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {filter === "unread" ? "You're all caught up!" : "Try adjusting your filters"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`transition-all hover:shadow-md ${
                      !notif.isRead ? "bg-blue-50/50 border-blue-200 border-l-4 border-l-primary" : "bg-white"
                    } ${notif.priority === "high" ? "border-l-4 border-l-red-500" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">
                                  {notif.title}
                                </h3>
                                {!notif.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {notif.message}
                              </p>
                              
                              {/* Additional Info */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                {notif.orderId && (
                                  <Badge variant="secondary" className="text-xs">
                                    Order: {notif.orderId}
                                  </Badge>
                                )}
                                {notif.productName && (
                                  <Badge variant="outline" className="text-xs">
                                    {notif.productName}
                                  </Badge>
                                )}
                                {notif.couponCode && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    Code: {notif.couponCode}
                                  </Badge>
                                )}
                                {notif.points && (
                                  <Badge variant="default" className="text-xs bg-purple-600">
                                    +{notif.points} Points
                                  </Badge>
                                )}
                                {notif.amount && (
                                  <Badge variant="secondary" className="text-xs">
                                    {notif.amount}
                                  </Badge>
                                )}
                              </div>

                              {/* Action Button */}
                              {notif.actionUrl && notif.actionText && (
                                <div className="mt-3">
                                  <Button
                                    variant="link"
                                    size="sm"
                                    className="h-auto p-0 text-primary hover:text-primary/80"
                                    asChild
                                  >
                                    <Link href={notif.actionUrl}>
                                      {notif.actionText} →
                                    </Link>
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              {new Date(notif.createdAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>

                            <div className="flex gap-2">
                              {!notif.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notif.id)}
                                  className="h-8 text-xs"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Mark read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notif.id)}
                                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
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
          </>
        ) : (
          // EMPTY STATE
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <Bell className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-primary">
              No notifications yet
            </h2>

            <p className="text-muted-foreground mb-6">
              We&apos;ll notify you when there&apos;s something new!
            </p>

            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}