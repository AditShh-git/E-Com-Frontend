"use client";

import { useUserStore } from "@/store/user-store";

export default function SellerLayout({ children }) {

  const { role, isLoggedIn } = useUserStore();

  
  if (!isLoggedIn || role !== "USER") {
    return <div>Not authorized</div>;
  }

  return <>{children}</>;
}
