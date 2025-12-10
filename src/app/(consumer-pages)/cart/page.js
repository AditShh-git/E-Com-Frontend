"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =====================================
   ❌ BACKEND + STORE IMPORTS DISABLED
===================================== */
// import API from "@/utils/consumerApi";
// import { toast } from "sonner";
// import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  /* =====================================
     ✅ FRONTEND MOCK DATA
  ===================================== */
  useEffect(() => {
    setCartItems([
      {
        id: 1,
        title: "Product 1",
        subtitle: "Oak Dining Table",
        image: "/placeholder.svg",
        quantity: 1,
        price: 199.99,
      },
      {
        id: 2,
        title: "Product 2",
        subtitle: "Cozy Armchair",
        image: "/placeholder.svg",
        quantity: 2,
        price: 149.99,
      },
      {
        id: 3,
        title: "Product 3",
        subtitle: "Modern Floor Lamp",
        image: "/placeholder.svg",
        quantity: 1,
        price: 199.99,
      },
    ]);
  }, []);

  /* =====================================
     ✅ QUANTITY HANDLERS (FRONTEND ONLY)
  ===================================== */
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((it) =>
        it.id === id && it.quantity > 1
          ? { ...it, quantity: it.quantity - 1 }
          : it
      )
    );
  };

  /* =====================================
     ✅ PRICE CALCULATIONS
  ===================================== */
  const subtotal = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  const shipping = 20;
  const taxes = 35;
  const total = subtotal + shipping + taxes;

  return (
    <div className="container mx-auto px-6 py-10 max-w-5xl border rounded">

      {/* BREADCRUMB */}
      <p className="text-sm text-muted-foreground mb-2">
        Home / <span className="text-black">Shopping Cart</span>
      </p>

      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* CART LIST */}
      <div className="border rounded overflow-hidden">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border-b last:border-none"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                className="w-16 h-16 object-contain rounded bg-gray-100"
                alt=""
              />
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.subtitle}
                </div>
              </div>
            </div>

            {/* RIGHT (QTY CONTROLS) */}
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                onClick={() => decreaseQty(item.id)}
                className="bg-red-700 hover:bg-red-800 text-white rounded-full w-8 h-8"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="font-medium w-4 text-center">
                {item.quantity}
              </span>

              <Button
                size="icon"
                onClick={() => increaseQty(item.id)}
                className="bg-red-700 hover:bg-red-800 text-white rounded-full w-8 h-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="mt-6 border rounded p-4 shadow-sm">
        <h2 className="font-semibold mb-3">Order Summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>Taxes</span>
            <span>${taxes.toFixed(2)}</span>
          </div>

          <div className="flex justify-between pt-2 font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CHECKOUT BUTTON */}
      <div className="flex justify-end mt-8">
        <Button className="bg-red-500 hover:bg-red-600 text-black rounded-full px-8 py-6">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}

