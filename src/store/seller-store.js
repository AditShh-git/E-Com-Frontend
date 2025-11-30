import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSellerStore = create(
  persist(
    (set) => ({
      seller: null,
      token: null,
      isLoggedIn: false,

      
      setSeller: (sellerObj) =>
        set({
          seller: sellerObj,
        }),

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
