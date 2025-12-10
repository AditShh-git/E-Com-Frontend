"use client";

import { Card } from "@/components/ui/card";
import { useSellerStore } from "@/store/seller-store";

export default function SellerLayout({ children }) {
  const { isLoggedIn, seller } = useSellerStore();

  // If seller NOT logged in → block
  // if (!isLoggedIn || !seller) {
  //   return (
  //     <Card className="bg-gray-200 text-center p-4">
  //       <p>Not authorized</p>
  //     </Card>
  //   );
  // }

  return <>{children}</>;
}
