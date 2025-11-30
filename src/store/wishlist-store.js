"use client";

import { create } from "zustand";
import API from "@/utils/consumerApi";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export const useWishlistStore = create((set, get) => ({

  wishlistItems: [],
  isLoading: false,

  // Check if product already in wishlist
  isWishlisted: (productId) => {
    const list = get().wishlistItems || [];
    return list.some(
      (item) =>
        item.productId == productId ||
        item.id == productId ||
        item.docId == productId
    );
  },

  // Fetch wishlist (ONLY FOR USER)
 fetchWishlist: async () => {
  try {
    const role = useUserStore.getState().role;

    if (role !== "USER") {
      set({ wishlistItems: [] });
      return;
    }

    set({ isLoading: true });

    const res = await API.get("/aimdev/api/wishlist"); // keep same call

    // --- defensive extraction of list from many possible shapes ---
    let rawList = [];
    if (!res) rawList = [];
    else if (Array.isArray(res.data)) rawList = res.data;
    else if (Array.isArray(res.data?.carts)) rawList = res.data.carts;
    else if (Array.isArray(res.data?.data)) rawList = res.data.data;
    else if (Array.isArray(res.data?.data?.data)) rawList = res.data.data.data;
    else if (Array.isArray(res.data?.data?.carts)) rawList = res.data.data.carts;
    else rawList = res.data?.data || res.data || [];

    // debug — remove/keep as needed
    console.log("WISHLIST RAW RESPONSE:", res);
    console.log("WISHLIST RAW LIST:", rawList);

    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

    const mappedList = (rawList || []).map((item) => {
      // possible name fields
      const name = item.pname || item.name || item.title || item.productName || "";

      // pick an id
      const id = item.productId ?? item.id ?? item.docId ?? null;

      // build image URL defensively
      let img = item.image || item.imageUrl || item.image_path || item.imageUrlPath || "";

      // If img is relative (starts with "/"), prefix backend base
      if (img && img.startsWith("/")) {
        // Some endpoints include /aimdev already; if backend expects /aimdev prefix but img doesn't have it, try both:
        if (img.startsWith("/aimdev") || base.endsWith("/aimdev")) {
          img = `${base}${img}`; // base already contains /aimdev or img has it
        } else {
          // prefer base + img
          img = `${base}${img}`;
        }
      }

      // If image is a numeric file id (e.g. "652"), try constructing public file path
      if (!img && (item.imageFileIds?.length || item.imageFileId)) {
        const fileId = item.imageFileIds?.[0] ?? item.imageFileId;
        img = `${base}/aimdev/api/files/public/${fileId}/view`;
      }

      // final fallback
      if (!img) img = "/placeholder.svg";

      return {
        // keep original fields for backward compatibility
        ...item,
        id,
        productId: item.productId ?? id,
        name,
        pname: item.pname ?? name,
        description: item.description ?? item.desc ?? "",
        price: item.price ?? item.unitPrice ?? 0,
        image: img,
      };
    });

    set({ wishlistItems: mappedList });
  } catch (err) {
    console.error("Wishlist fetch error", err);
    set({ wishlistItems: [] });
  } finally {
    set({ isLoading: false });
  }
},


  // Clear wishlist
  clearWishlist: () => set({ wishlistItems: [] }),

  // Add item
  addToWishlist: async (productId) => {
    try {
      const res = await API.post(`/aimdev/api/wishlist/${productId}`);
      await get().fetchWishlist();
      return true;
    } catch (err) {
      toast.error("Failed to add");
      return false;
    }
  },

  // Remove item
  removeFromWishlist: async (productId) => {
    try {
      await API.delete(`/aimdev/api/wishlist/${productId}`);

      set({
        wishlistItems: get().wishlistItems.filter(
          (item) =>
            item.productId != productId &&
            item.id != productId &&
            item.docId != productId
        ),
      });

      return true;
    } catch (err) {
      toast.error("Failed to remove");
      return false;
    }
  },

  // Toggle wishlist
  toggleWishlist: async (productId) => {
    const exists = get().isWishlisted(productId);

    if (exists) {
      const ok = await get().removeFromWishlist(productId);
      if (ok) toast.success("Removed from wishlist");
    } else {
      const ok = await get().addToWishlist(productId);
      if (ok) toast.success("Added to wishlist");
    }
  },

}));
