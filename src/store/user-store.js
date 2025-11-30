import { create } from "zustand";

export const useUserStore = create((set) => ({
  isLoggedIn: false,
  role: null,
  user: null,
  token: null,     // ✅ ADD THIS

  login: (userData, token, role) =>
    set(() => ({
      isLoggedIn: true,
      role: role,
      token: token,    // ✅ SAVE TOKEN HERE
      user: {
        docId: userData.docId,
        username: userData.fullName,
        email: userData.email,
        imageUrl: userData.imageUrl,
      }
    })),

  logout: () =>
    set(() => ({
      isLoggedIn: false,
      role: null,
      user: null,
      token: null,   
    })),
}));
