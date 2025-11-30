"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/utils/consumerApi";
import { toast } from "sonner";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [popupItem, setPopupItem] = useState(null);

  // Normalize backend response
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

    if (url.startsWith("/api/files/")) {
      const final = url.replace("/api/files/", "/aimdev/api/files/public/");
      return `${backend}${final}`;
    }

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

    // Keep inactive logic -> backend sends available=false if seller deactivated
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

    const item = prev.find((it) => it.id === cartId);
    if (item?.available === false) {
      return toast.error("Product is no longer available.");
    }

    markUpdating(cartId);

    setCartItems((prev) =>
      prev.map((it) =>
        (it.id ?? it.cartId) === cartId ? { ...it, quantity: newQty } : it
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

  const removeItem = async (cartId, silent = false) => {
    const prev = cartItems.map((it) => ({ ...it }));
    markUpdating(cartId);

    setCartItems((prev) =>
      prev.filter((it) => (it.id ?? it.cartId) !== cartId)
    );

    try {
      await API.delete(`/aimdev/api/cart/remove?cartId=${cartId}`);

      if (!silent) {
        toast.success("Item removed");
      }
    } catch (err) {
      toast.error("Could not remove. Reverting.");
      setCartItems(prev);
    } finally {
      unmarkUpdating(cartId);
    }
  };

  const subtotal = cartItems.reduce(
    (s, it) => s + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );

  const shipping = subtotal > 1000 ? 0 : 49;
  const total = subtotal + shipping;

  const hasUnavailableItems = cartItems.some((it) => it.available === false);

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  return (
    <>
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
            {/* LEFT SECTION */}
            <div className="flex-1 space-y-4">
              {cartItems.map((it) => {
                const cartId = it.id;
                const qty = Number(it.quantity ?? 1);
                const title = it.pname || "Product";
                const img = getImageUrl(it);
                const isUpdating = updatingIds.has(cartId);

                return (
                  <div
                    key={cartId}
                    className={`flex items-center gap-4 border rounded p-4 shadow-sm transition-all 
                      ${
                        it.available === false
                          ? "bg-gray-100 opacity-70"
                          : "bg-white hover:shadow-md"
                      }`}
                  >
                    <img
                      src={img}
                      alt={title}
                      className="object-contain w-28 h-28 rounded bg-white p-2"
                    />

                    <div className="flex-1">
                      <div className="font-medium text-lg">{title}</div>

                      {/* Warning if product is inactive */}
                      {it.available === false && (
                        <div className="text-red-600 text-sm font-semibold mt-1">
                          ⚠ This product is no longer available
                        </div>
                      )}

                      <div className="flex items-center gap-3 mt-3">
                        {/* Disable minus */}
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={qty <= 1 || isUpdating || it.available === false}
                          onClick={() => updateQuantity(cartId, qty - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="w-8 text-center">{qty}</div>

                        {/* Disable plus */}
                        <Button
                          size="icon"
                          variant="outline"
                          disabled={isUpdating || it.available === false}
                          onClick={() => updateQuantity(cartId, qty + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>

                        {/* Remove */}
                        <Button
                          size="icon"
                          variant="destructive"
                          disabled={isUpdating}
                          onClick={() => setPopupItem({ cartId, item: it })}
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
            <div className="w-full md:w-1/3 bg-white border rounded p-6 shadow-lg">
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

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Updated Checkout Button Logic */}
              <Button
                className="w-full mt-6 bg-primary text-white"
                disabled={hasUnavailableItems}
                onClick={() => {
                  if (hasUnavailableItems) {
                    toast.error(
                      "Some items are no longer available. Remove them before checkout."
                    );
                    return;
                  }
                  window.location.href = "/checkout";
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP UI */}
      {popupItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[550px] flex gap-5 animate-scaleIn">
            <div className="w-40 h-40 rounded-lg overflow-hidden border">
              <img
                src={getImageUrl(popupItem.item)}
                alt=""
                className="object-contain w-full h-full p-2"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold">Remove Item?</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Would you like to move this item to your wishlist or remove it
                  permanently?
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                  onClick={async () => {
                    const productId = popupItem.item.productId;

                    try {
                      await API.post(`/aimdev/api/wishlist/${productId}`);
                      toast.success("Moved to wishlist ❤️");

                      removeItem(popupItem.cartId, true);
                    } catch (err) {
                      toast.error("Failed to move to wishlist");
                    } finally {
                      setPopupItem(null);
                    }
                  }}
                >
                  <Heart className="h-4 w-4 mr-2" /> Move to Wishlist
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    removeItem(popupItem.cartId);
                    setPopupItem(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remove from Cart
                </Button>

                <Button variant="outline" onClick={() => setPopupItem(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}
