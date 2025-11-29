import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      token: null,
      role: null,

      login: (userData, tokenData, roleData) =>
        set({
          user: userData,
          isLoggedIn: true,
          token: tokenData,
          role: roleData,
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          token: null,
          role: null,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
