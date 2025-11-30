"use client";

import { create } from "zustand";
import API from "@/utils/consumerApi";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export const useCartStore = create((set, get) => ({

  cartItems: [],
  isLoading: false,

  // Check existing product
  isInCart: (productId) => {
    const list = get().cartItems || [];
    return list.some(
      (item) =>
        item.productId == productId ||
        item.id == productId ||
        item.docId == productId
    );
  },

  // Fetch cart
  fetchCart: async () => {
  try {
    const role = useUserStore.getState().role;

    if (role !== "USER") {
      set({ cartItems: [] });
      return;
    }

    set({ isLoading: true });

    // FIXED API URL
    const res = await API.get("/aimdev/api/cart/my");

    let rawList = [];
    if (!res) rawList = [];
    else if (Array.isArray(res.data)) rawList = res.data;
    else if (Array.isArray(res.data?.carts)) rawList = res.data.carts;
    else if (Array.isArray(res.data?.data)) rawList = res.data.data;
    else if (Array.isArray(res.data?.data?.carts)) rawList = res.data.data.carts;
    else rawList = res.data?.data || res.data || [];

    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

    const mappedList = (rawList || []).map((item) => {
      const id = item.productId ?? item.id ?? item.docId ?? null;
      const name = item.pname ?? item.name ?? item.title ?? "";

      let img = item.image || item.imageUrl || "";
      if (img?.startsWith("/")) img = `${base}${img}`;
      if (!img) img = "/placeholder.svg";

      return {
        ...item,
        id,
        productId: id,
        name,
        image: img,
        quantity: item.quantity ?? 1,
        price: item.price ?? item.unitPrice ?? 0,
      };
    });

    set({ cartItems: mappedList });

  } catch (e) {
    console.error("CART FETCH ERROR", e);
    set({ cartItems: [] });
  } finally {
    set({ isLoading: false });
  }
},


  // Clear cart
  clearCart: () => set({ cartItems: [] }),

  // Add to cart
  addToCart: async (productId) => {
    try {
      await API.post(`/aimdev/api/cart/${productId}`);
      await get().fetchCart();
      toast.success("Added to cart");
      return true;
    } catch (e) {
      toast.error("Failed to add");
      return false;
    }
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    try {
      await API.delete(`/aimdev/api/cart/${productId}`);
      set({
        cartItems: get().cartItems.filter(
          (i) =>
            i.productId != productId &&
            i.id != productId &&
            i.docId != productId
        ),
      });
      toast.success("Removed from cart");
      return true;
    } catch (e) {
      toast.error("Failed to remove");
      return false;
    }
  },

  // Toggle
  toggleCart: async (productId) => {
    const exists = get().isInCart(productId);
    if (exists) {
      await get().removeFromCart(productId);
    } else {
      await get().addToCart(productId);
    }
  },

}));
