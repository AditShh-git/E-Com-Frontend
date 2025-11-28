"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/utils/consumerApi";
import { PUBLIC_FILE_URL } from "@/constants/backend-urls";
import { toast } from "sonner";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const normalizeCart = (res) => {
    const r = res?.data ?? res;

    if (Array.isArray(r)) return r;
    if (Array.isArray(r.carts)) return r.carts;
    if (Array.isArray(r.data)) return r.data;
    if (Array.isArray(r.data?.carts)) return r.data.carts;
    if (Array.isArray(r.data?.cart)) return r.data.cart;

    const arr = Object.values(r).find(Array.isArray);
    return arr || [];
  };

 const getImageUrl = (item) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL; 
  let url = item?.imageUrl;

  if (!url) return "/placeholder.svg";

  // If backend returns: /api/files/103/view
  if (url.startsWith("/api/files/")) {
    // Insert /public and /aimdev
    const final = url.replace("/api/files/", "/aimdev/api/files/public/");
    return `${backend}${final}`;
  }

  // Already correct
  if (url.startsWith("http")) return url;

  return `${backend}${url}`;
};


  const fetchCart = async () => {
    setLoading(true);

    const endpoints = ["/aimdev/api/cart/my", "/api/cart/my", "/cart/my"];
    let res = null;

    for (const ep of endpoints) {
      try {
        res = await API.get(ep);
        break;
      } catch (_) {}
    }

    if (!res) {
      setLoading(false);
      return toast.error("Failed to load cart");
    }

    const arr = normalizeCart(res);
    setCartItems(arr);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const markUpdating = (id) => setUpdatingIds((prev) => new Set(prev).add(id));
  const unmarkUpdating = (id) =>
    setUpdatingIds((prev) => {
      const c = new Set(prev);
      c.delete(id);
      return c;
    });

  const updateQuantity = async (cartId, newQty) => {
    if (newQty < 1) return;

    const prev = cartItems.map((it) => ({ ...it }));
    markUpdating(cartId);

    setCartItems((prev) =>
      prev.map((it) =>
        (it.id ?? it.cartId ?? it.productId) === cartId
          ? { ...it, quantity: newQty }
          : it
      )
    );

    try {
      await API.put(`/aimdev/api/cart/update?cartId=${cartId}&quantity=${newQty}`);
    } catch (err) {
      toast.error("Failed to update. Reverting.");
      setCartItems(prev);
    } finally {
      unmarkUpdating(cartId);
    }
  };

  const removeItem = async (cartId) => {
    const el = document.getElementById(`cart-item-${cartId}`);
    if (!el) return;

    el.style.transition = "all 0.30s ease";
    el.style.opacity = "0";
    el.style.transform = "translateX(-20px)";
    el.style.height = el.offsetHeight + "px";

    setTimeout(() => {
      el.style.height = "0px";
      el.style.padding = "0px";
      el.style.margin = "0px";
    }, 100);

    setTimeout(async () => {
      const prev = cartItems.map((it) => ({ ...it }));
      markUpdating(cartId);

      setCartItems((prev) =>
        prev.filter((it) => (it.id ?? it.cartId ?? it.productId) !== cartId)
      );

      try {
        await API.delete(`/aimdev/api/cart/remove?cartId=${cartId}`);
        toast.success("Item removed");
      } catch (err) {
        toast.error("Could not remove. Reverting.");
        setCartItems(prev);
      } finally {
        unmarkUpdating(cartId);
      }
    }, 280);
  };

  const subtotal = cartItems.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );

  const shipping = subtotal > 1000 ? 0 : 49;
  const total = subtotal + shipping;

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p>Your cart is empty.</p>
          <Link href="/products">
            <Button className="mt-4 bg-primary">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT */}
          <div className="flex-1 space-y-4">
            {cartItems.map((it) => {
              const id = it.id ?? it.cartId ?? it.productId;
              const qty = Number(it.quantity ?? 1);

              // ⭐ FIX FOR NAME
              const title =
                it.pname ||
                it.name ||
                it.productName ||
                it.title ||
                "Product";

              const img = getImageUrl(it);
              const isUpdating = updatingIds.has(id);

              return (
                <div
                  key={id}
                  id={`cart-item-${id}`}
                  className="flex items-center gap-4 border rounded p-4 bg-white transition-all duration-300"
                >
                  <div className="w-28 h-28 bg-white rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={img}
                      alt={title}
                      className="object-contain p-2 w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-lg">{title}</div>

                    <div className="flex items-center gap-3 mt-3">
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={qty <= 1 || isUpdating}
                        onClick={() => updateQuantity(id, qty - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <div className="w-8 text-center">{qty}</div>

                      <Button
                        size="icon"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => updateQuantity(id, qty + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={isUpdating}
                        onClick={() => removeItem(id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right font-bold text-primary">
                    ₹{(Number(it.price || 0) * qty).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="w-full md:w-1/3 bg-white border rounded p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full mt-6 bg-primary text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
