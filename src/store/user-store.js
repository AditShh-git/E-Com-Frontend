"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isLoggedIn: false,

      login: (userData, token, role) =>
        set({
          user: userData,
          token: token,
          role: role,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
