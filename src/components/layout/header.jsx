"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  Bell,
  LogOut,
  Package,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import { useUserStore } from "@/store/user-store";

// ✅ cart store
import { useCartStore } from "@/store/cart-store";

// ✅ wishlist store
import { useWishlistStore } from "@/store/wishlist-store";

import { logout_url } from "@/constants/backend-urls";
import axios from "axios";

export const handleLogout = () => {
  try {
    axios.post(logout_url, {}, { withCredentials: true });
    localStorage.removeItem("user-storage");
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export default function Header() {
  const { role, isLoggedIn, user } = useUserStore();

  // ⭐ WISHLIST STORE (FIXED)
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const wishlistCount = wishlistItems.length;

  // ⭐ CART STORE (FIXED)
  const cartItems = useCartStore((state) => state.cartItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const cartCount = cartItems.length;

  // ⭐ NOTIFICATIONS (You can add a store later for actual notification count)
  const [notificationCount, setNotificationCount] = useState(3); // Replace with actual store

  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ⭐ Load wishlist + cart on login
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
      fetchCart();
    } else {
      clearWishlist();
    }
  }, [isLoggedIn]);

  const mainNavItems = [
    { name: "Home", href: "/" },
    {
      name: "Categories",
      href: "#",
      children: [
        { name: "Electronics", href: "/categories/electronics" },
        { name: "Home & Garden", href: "/categories/home-garden" },
        { name: "Fashion", href: "/categories/fashion" },
        { name: "Digital Services", href: "/categories/digital-services" },
        { name: "Sports & Outdoors", href: "/categories/sports-outdoors" },
      ],
    },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  // Hide header for seller
  if (isLoggedIn && role === "seller") {
    return <div className="bg-gray-200 text-center"><p></p></div>;
  }

  // Hide header for admin
  const location = usePathname();
  if (location.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">

      {/* Top Bar */}
      <div className="hidden md:flex h-10 items-center justify-between bg-primary text-primary-foreground px-4 text-sm">
        <div className="flex items-center space-x-4">
          <span>Customer Service: +91 0000000000</span>
          <span>|</span>
          <span>Free Shipping on Orders Over Rs.500</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/track-order" className="hover:underline">Track Order</Link>
          <span>|</span>
          <Link href="/store-locator" className="hover:underline">Store Locator</Link>
          <span>|</span>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
              <span>English</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Hindi</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Mobile Menu + Logo */}
        <div className="flex flex-row">
          <Sheet>
            <SheetTrigger asChild className="md:hidden p-0 m-0">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[350px]">

              <div className="flex flex-col h-full">

                {/* Mobile Header */}
                <div className="py-4 border-b">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <ShoppingCart className="h-6 w-6" />
                    <span>OneAim</span>
                  </Link>
                </div>

                {/* Nav Items Mobile */}
                <nav className="flex-1 overflow-auto py-4">
                  <ul className="space-y-2">
                    {mainNavItems.map((item) => (
                      <li key={item.name}>
                        {item.children ? (
                          <div className="space-y-2">
                            <div className="px-4 py-2 font-medium">{item.name}</div>

                            <ul className="pl-4 space-y-1">
                              {item.children.map((child) => (
                                <li key={child.name}>
                                  <SheetClose asChild>
                                    <Link href={child.href} className="block px-4 py-2 text-muted-foreground hover:text-primary">
                                      {child.name}
                                    </Link>
                                  </SheetClose>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className={`block px-4 py-2 ${pathname === item.href ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}
                            >
                              {item.name}
                            </Link>
                          </SheetClose>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Account */}
                <div className="border-t py-4 space-y-4">
                  {isLoggedIn ? (
                    <div className="px-4 space-y-2">
                      <div className="font-medium">Hello, {user?.username}</div>

                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/account"><User className="mr-2 h-4 w-4" /> My Account</Link>
                      </Button>

                      <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="px-4 space-y-2">
                      <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                        <Link href="/signin">Sign In</Link>
                      </Button>

                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/signup">Create Account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block text-primary">
              OneAim
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {mainNavItems.map((item) => (
            <div key={item.name} className="relative group">

              {item.children ? (
                <>
                  <button className="flex items-center text-sm font-medium hover:text-primary">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 w-48 z-50">
                    <ul className="space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <Link href={child.href} className="block px-3 py-2 text-sm hover:bg-muted rounded-md">
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm font-medium ${pathname === item.href ? "text-primary" : "hover:text-primary"}`}
                >
                  {item.name}
                </Link>
              )}

            </div>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">

          {/* Desktop Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-[200px] lg:w-[300px] pl-10 border-primary/30 focus-visible:ring-primary"
            />
          </div>

          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-5 w-5" />
          </Button>

          {/* Account */}
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/account"><User className="mr-2 h-4 w-4" /> My Account</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/account"><Package className="mr-2 h-4 w-4" /> My Orders</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/account"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/get-started"><User className="h-5 w-5" /></Link>
            </Button>
          )}

          {/* Wishlist (FIXED) */}
          <Button variant="ghost" size="icon" className="relative hidden sm:flex" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white p-0">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Notifications (NEW - placed after wishlist) */}
          <Button variant="ghost" size="icon" className="relative hidden sm:flex" asChild>
            <Link href="/notifications">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white p-0">
                  {notificationCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Cart (FIXED) */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white p-0">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

        </div>
      </div>

      {/* Mobile Search */}
      {isSearchOpen && (
        <div className="md:hidden p-4 border-t">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 border-primary/30 focus-visible:ring-primary"
              autoFocus
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

          </div>
        </div>
      )}

    </header>
  );
}

