"use client";

import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/user-store";

export default function SellerLayout({ children }) {
  const { role, isLoggedIn } = useUserStore();

  if (!isLoggedIn || role?.toUpperCase() !== "SELLER") {
    return (
      <Card className="bg-gray-200 text-center p-4">
        <p>Not authorized</p>
      </Card>
    );
  }

  return <>{children}</>;
}
