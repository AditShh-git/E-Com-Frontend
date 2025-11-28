"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/ui-components/add-to-cart-button";
import { PriceDisplay } from "@/components/ui-components/price-display";
import { cn } from "@/lib/utils";
import { PUBLIC_FILE_URL } from "@/constants/backend-urls";
import { useWishlistStore } from "@/store/wishlist-store";
import { Heart } from "lucide-react";

export function ProductListItem({
  product,
  className,
  showAddToCart = true,
  showWishlist = true,
  showDescription = true,
}) {
  if (!product) return null;

  // ==========================
  // Resolve product fields
  // ==========================
  const productId = product.id || product.productId || product.docId;
  const productName = product.name || product.pname || "Product";
  const productPrice = product.price;
  const productCategory = product.categoryName || product.category || "Category";
  const productDescription = product.description || "";

  // IMAGE
  const imageFile =
    product.imageUrl ||
    (product.imageFiles?.[0]?.fileId
      ? `${PUBLIC_FILE_URL}/${product.imageFiles[0].fileId}`
      : product.image || "/placeholder.svg");

  // DISCOUNT
  const discountPercentage = product.offer || product.discount || 0;
  const originalPrice =
    discountPercentage > 0
      ? Math.round(productPrice / (1 - discountPercentage / 100))
      : product.originalPrice || null;

  // ==========================
  // Wishlist Store
  // ==========================
  const { isWishlisted, addToWishlist, removeFromWishlist } =
    useWishlistStore();

  const wished = isWishlisted(productId);

  const toggleWishlist = async () => {
    try {
      if (wished) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-md border border-gray-200",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* IMAGE */}
        <div className="relative w-full sm:w-48 h-48 bg-white">
          <Link href={`/products/${productId}`}>
            <Image
              src={imageFile}
              alt={productName}
              fill
              className="object-contain p-4"
            />
          </Link>

          {/* BADGES */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <Badge className="bg-primary text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.isNew && <Badge className="bg-green-600 text-white">NEW</Badge>}
            {product.isFeatured && (
              <Badge className="bg-amber-500 text-white">FEATURED</Badge>
            )}
          </div>

          {/* WISHLIST */}
          {showWishlist && (
            <button
              onClick={toggleWishlist}
              className={`absolute top-2 right-2 p-2 rounded-full border transition ${
                wished
                  ? "bg-red-500 text-white border-red-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* CONTENT */}
        <CardContent className="flex-1 p-4 flex flex-col">
          <Link href={`/products/${productId}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition">
              {productName}
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm mb-2 capitalize">
            {productCategory}
          </p>

          {showDescription && productDescription && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {productDescription}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <PriceDisplay price={productPrice} originalPrice={originalPrice} />

            {showAddToCart && (
              <AddToCartButton
                product={product}
                variant="default"
                showQuantity={false}
                className="bg-primary hover:bg-primary/90"
              />
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
