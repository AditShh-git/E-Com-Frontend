"use client";


import Image from "next/image";
import Link from "next/link";
import { Share2, ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";

import API from "@/utils/consumerApi";
import { useWishlistStore } from "@/store/wishlist-store";
import { normalizeProduct } from "@/utils/normalize-product";

export default function ProductCard({ product }) {
  const p = normalizeProduct(product);
  if (!p) return null;

console.log("🔗 FINAL IMAGE URL:", p.imageUrl);


  const { isWishlisted, addToWishlist } = useWishlistStore();
  const wished = isWishlisted(p.id);

  // ADD TO CART
  const handleAddToCart = async () => {
    try {
      await API.post(`/aimdev/api/cart/add`, null, {
        params: { productId: p.id },
      });
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // ADD TO WISHLIST
  const handleWishlist = async () => {
    const ok = await addToWishlist(p.id);
    if (ok) toast.success("Added to wishlist");
  };

  // SHARE
  const handleShare = async () => {
    const msg =
      p.shareMessage ||
      `Check out this product: ${p.name}\n${window.location.origin}/products/${p.slug}`;

    try {
      await navigator.share({
        title: p.name,
        text: msg,
        url: msg.split("\n").pop(),
      });
    } catch {
      navigator.clipboard.writeText(msg);
      toast.success("Share link copied");
    }
  };

  return (
    <div className="border rounded-lg bg-white p-3 shadow hover:shadow-md transition">
      <Link href={`/products/${p.slug ?? p.id}`}>
        <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
          <Image
            src={p.imageUrl}        // ✔ ALWAYS correct after updated normalizeProduct()
            alt={p.name}
            fill
            unoptimized
            className="object-contain p-3"
          />
        </div>

        <h3 className="mt-3 font-medium text-sm line-clamp-1">{p.name}</h3>
        <p className="text-primary font-bold">₹{p.price}</p>
      </Link>

      <div className="flex items-center justify-between mt-3">
        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="p-2 rounded-full bg-primary text-white"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>

        {/* SHARE */}
        <button
          onClick={handleShare}
          className="p-2 rounded-full border hover:bg-gray-100"
        >
          <Share2 className="h-4 w-4" />
        </button>

        {/* WISHLIST */}
        <button
          onClick={handleWishlist}
          className={`p-2 rounded-full border ${
            wished ? "bg-red-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
