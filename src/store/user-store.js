import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      user: null, // { sellerId, fullname, username, email }
      isLoggedIn: false,
      token: null, // accessToken saved here
      role: null,

      login: (userData, tokenData, userRole) =>
        set({
          user: userData,
          isLoggedIn: true,
          token: tokenData,
          role: userRole
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          token: null,
          role: null
        }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
