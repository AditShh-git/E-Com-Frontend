"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";
import { useEffect, useState } from "react";

export function WishlistButton({ productId, size = "icon", variant = "secondary" }) {
  const { wishlistItems, isWishlisted, toggleWishlist } = useWishlistStore((s) => ({
    wishlistItems: s.wishlistItems,
    isWishlisted: s.isWishlisted,
    toggleWishlist: s.toggleWishlist,
  }));

  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    setInWishlist(isWishlisted(productId));
  }, [wishlistItems, productId, isWishlisted]);

  return (
    <Button
      size={size}
      variant={variant}
      onClick={() => toggleWishlist(productId)}
      className={cn(
        size === "icon" && "h-8 w-8 rounded-full",
        inWishlist && "text-primary bg-primary/10"
      )}
    >
      <Heart className={cn("h-4 w-4", inWishlist && "fill-primary")} />
    </Button>
  );
}
