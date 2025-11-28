"use client";

import { create } from "zustand";
import API from "@/utils/consumerApi";
import { toast } from "sonner";

export const useWishlistStore = create((set, get) => ({

  wishlistItems: [],
  isLoading: false,

  // CHECK IF ALREADY IN WISHLIST
  isWishlisted: (productId) => {
    const list = get().wishlistItems || [];
    return list.some(
      (item) =>
        item.productId == productId ||
        item.id == productId ||
        item.docId == productId
    );
  },

  // LOAD ALL WISHLIST ITEMS
  fetchWishlist: async () => {
    try {
      set({ isLoading: true });

      const res = await API.get("/aimdev/api/wishlist");

      const list =
        res?.data?.data?.data ||
        res?.data?.data ||
        [];

      set({ wishlistItems: list });
    } catch (err) {
      console.error("Wishlist fetch error", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // CLEAR ON LOGOUT
  clearWishlist: () => set({ wishlistItems: [] }),

  // ADD TO WISHLIST
  addToWishlist: async (productId) => {
    try {
      await API.post(`/aimdev/api/wishlist/${productId}`);
      await get().fetchWishlist();
      return true;
    } catch (err) {
      toast.error("Failed to add");
      return false;
    }
  },

  // REMOVE FROM WISHLIST
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

  // TOGGLE
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
