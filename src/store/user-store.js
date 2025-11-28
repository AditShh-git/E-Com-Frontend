import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email, ... }
      isLoggedIn: false,
      token: null,
      role: null,
      login: (userData, tokenData, userRole) => set({ user: userData, isLoggedIn: true, token: tokenData, role: userRole }),
      logout: () => set({ user: null, isLoggedIn: false, token: null, role: null }),
    }),
    {
      name: 'user-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)