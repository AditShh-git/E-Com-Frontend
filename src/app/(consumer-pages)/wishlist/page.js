"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui-components/product-card"; // ✅ default export
import { ProductListItem } from "@/components/ui-components/product-list-item";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlist-store";

export default function WishlistPage() {
  const {
    wishlistItems,
    isLoading,
    fetchWishlist,
    removeFromWishlist,
  } = useWishlistStore();

  const [viewMode, setViewMode] = useState("grid");

  // Load wishlist on page load
  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.success("Item removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">My Wishlist</h1>

        {wishlistItems && wishlistItems.length > 0 ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                You have{" "}
                <span className="font-medium text-foreground">
                  {wishlistItems.length}
                </span>{" "}
                items in your wishlist
              </p>

              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>

            {/* GRID VIEW */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                  const id = item.id || item.productId || item.docId;

                  return (
                    <div key={id} className="relative group">
                      <ProductCard product={item} showWishlist={false} />

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white shadow-md border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFromWishlist(id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {wishlistItems.map((item) => {
                  const id = item.id || item.productId || item.docId;

                  return (
                    <div key={id} className="relative group">
                      <ProductListItem product={item} showWishlist={false} />

                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white shadow-md border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        onClick={() => handleRemoveFromWishlist(id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // EMPTY STATE
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-2xl font-bold mb-2 text-primary">
              Your wishlist is empty
            </h2>

            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added anything yet.
            </p>

            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
