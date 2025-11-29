// src/store/seller-store.js
// Zustand seller store persisted to "seller-auth"

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSellerStore = create(
  persist(
    (set) => ({
      seller: null,
      token: null,
      isLoggedIn: false,

      login: (sellerObj, token) =>
        set({
          seller: sellerObj,
          token: token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          seller: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "seller-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
