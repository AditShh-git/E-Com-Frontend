"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import API from "@/utils/consumerApi";
import { PUBLIC_FILE_URL } from "@/constants/backend-urls";

/**
 * CheckoutPage
 *
 * - Fetch cart from backend
 * - Update quantity / remove item without full reload (optimistic)
 * - Place order (COD or ONLINE)
 * - For ONLINE: create Razorpay order -> open checkout -> verify -> redirect
 */

export default function CheckoutPage() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState("shipping"); // shipping | payment | review
  const [isProcessing, setIsProcessing] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // ONLINE | COD
  const [shippingMethod, setShippingMethod] = useState("standard"); // standard | express | free

  const normalizeCart = (res) => {
    const r = res?.data ?? res;
    if (!r) return [];
    if (Array.isArray(r)) return r;
    if (Array.isArray(r.carts)) return r.carts;
    if (Array.isArray(r.data)) return r.data;
    if (Array.isArray(r.data?.carts)) return r.data.carts;
    if (Array.isArray(r.data?.cart)) return r.data.cart;
    const val = Object.values(r).find(Array.isArray);
    return val || [];
  };

  const getImageUrl = (item) => {
    if (!item) return "/placeholder.svg";
    const url = item.imageUrl || item.image || item.imagePath || item.img || item.filePath;
    if (url) {
      if (/^https?:\/\//.test(url)) return url;
      if (url.startsWith("/")) {
        const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
        return base + url;
      }
      return url;
    }
    const id = item.imageId || item.fileId || item.imageFileId;
    return id ? `${PUBLIC_FILE_URL}/${id}` : "/placeholder.svg";
  };

  const fetchCart = async () => {
    setCartLoading(true);
    const endpoints = ["/aimdev/api/cart/my", "/api/cart/my", "/cart/my"];
    let res = null;
    for (const ep of endpoints) {
      try {
        res = await API.get(ep);
        break;
      } catch (err) {
        res = null;
      }
    }
    if (!res) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }
    const arr = normalizeCart(res);
    setCartItems(arr);
    setCartLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (total, it) => total + Number(it.price || 0) * Number(it.quantity || 1),
    0
  );
  const shipping =
    shippingMethod === "express" ? 15.99 : shippingMethod === "standard" ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Update quantity (optimistic + call backend)
  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    // optimistic UI
    setCartItems((prev) => prev.map((it) => (it.id === cartId ? { ...it, quantity: newQuantity } : it)));
    try {
      await API.put(`/aimdev/api/cart/update?cartId=${cartId}&quantity=${newQuantity}`);
      // refresh to keep in-sync
      await fetchCart();
      toast.success("Quantity updated");
    } catch (err) {
      console.error("Update quantity error", err);
      toast.error("Failed to update quantity");
      // rollback: refetch
      fetchCart();
    }
  };

  const removeItem = async (cartId) => {
    const prev = cartItems;
    setCartItems((p) => p.filter((it) => it.id !== cartId));
    try {
      await API.delete(`/aimdev/api/cart/remove?cartId=${cartId}`);
      toast.success("Item removed");
      await fetchCart();
    } catch (err) {
      console.error("Remove item error", err);
      toast.error("Failed to remove item");
      setCartItems(prev); // rollback
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
      toast.error("Please fill required shipping fields");
      return;
    }
    setActiveStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setActiveStep("review");
    window.scrollTo(0, 0);
  };

  // Place order flow
  // replace the previous handlePlaceOrder with this improved version
const handlePlaceOrder = async () => {
  setIsProcessing(true);

  const payload = {
    fullName: `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim(),
    street: shippingInfo.address + (shippingInfo.apartment ? `, ${shippingInfo.apartment}` : ""),
    city: shippingInfo.city,
    state: shippingInfo.state,
    zip: shippingInfo.zipCode,
    country: shippingInfo.country,
    phone: shippingInfo.phone,
    paymentMethod: paymentMethod === "COD" ? "COD" : "ONLINE",
  };

  try {
    // 1) create order on backend
    const orderRes = await API.post("/aimdev/api/orders/place", payload);
    const orderBody = orderRes?.data ?? orderRes ?? {};
    if (orderBody?.status !== "SUCCESS" && !orderBody?.data) {
      // allow some backends that return created object directly; otherwise stop
      if (!(orderBody && Object.keys(orderBody).length)) throw new Error("Failed to place order");
    }

    const d = orderBody.data ?? orderBody;
    // try many possible places where backend might put orderId
    let createdOrderId =
      d?.orderId ||
      d?.order?.orderId ||
      d?.orderNo ||
      d?.invoiceno ||
      d?.orderIdNo ||
      d?.order_id ||
      d?.order?.id ||
      null;

    // If we still don't have an order id, try to read from nested data.data
    if (!createdOrderId && d?.data) {
      const dd = d.data;
      createdOrderId =
        dd?.orderId || dd?.orderNo || dd?.invoiceno || dd?.order_id || null;
    }

    // If still missing, try to fetch latest order(s) from user's orders endpoint (fallback)
    if (!createdOrderId) {
      console.warn("No order id detected from place-order response. Attempting to fetch user's latest order.");
      try {
        const myOrdersEndpoints = ["/aimdev/api/orders/my", "/api/orders/my", "/orders/my", "/aimdev/api/orders"];
        let myOrdersRes = null;
        for (const ep of myOrdersEndpoints) {
          try {
            myOrdersRes = await API.get(ep);
            if (myOrdersRes) break;
          } catch (e) {
            myOrdersRes = null;
          }
        }
        if (myOrdersRes) {
          const body = myOrdersRes?.data ?? myOrdersRes;
          // try common nested shapes
          const arr =
            body?.data?.data || body?.data || body?.data?.orders || body?.orders || body;
          // pick first order if it's an array
          if (Array.isArray(arr) && arr.length > 0) {
            const latest = arr[0];
            createdOrderId =
              latest?.orderId || latest?.order_id || latest?.orderNo || latest?.invoiceno || latest?.orderIdNo || null;
          }
        }
      } catch (e) {
        console.warn("Could not fetch user's orders fallback:", e);
      }
    }

    // If order created and paymentMethod is COD -> redirect right away
    if (paymentMethod === "COD") {
      toast.success("Order placed (Cash on Delivery)");
      router.push(`/order-confirmation?orderId=${encodeURIComponent(createdOrderId || "")}`);
      return;
    }

    // At this point we need an order id to create payment
    if (!createdOrderId) {
      throw new Error("Could not detect created order id. Payment cannot be initiated.");
    }

    // 2) call /payment/create; try a few likely payload shapes if first attempt fails
    const createPayloadCandidates = [
      { orderId: createdOrderId },
      { order_id: createdOrderId },
      { orderNo: createdOrderId },
      { invoiceNo: createdOrderId },
      { orderIdNo: createdOrderId },
    ];

    let createRes = null;
    let lastError = null;
    for (const candidate of createPayloadCandidates) {
      try {
        createRes = await API.post("/aimdev/api/payment/create", candidate);
        if (createRes) break; // success
      } catch (err) {
        lastError = err;
        // if server responded with 400, capture body for easier debugging
        if (err?.response) {
          console.error("payment/create failed response:", {
            status: err.response.status,
            data: err.response.data,
            attemptedPayload: candidate,
          });
        } else {
          console.error("payment/create request error:", err, "payload:", candidate);
        }
        // try next candidate
      }
    }

    if (!createRes) {
      // all payloads failed
      const backendMessage =
        lastError?.response?.data?.message ||
        lastError?.response?.data?.error ||
        lastError?.message ||
        "Payment initialization failed with status 400";
      throw new Error(backendMessage);
    }

    // parse payment create response (robust)
    const createBody = createRes?.data ?? createRes ?? {};
    const payInfo =
      createBody?.data?.data ??
      createBody?.data ??
      createBody;

    const key = payInfo?.key || payInfo?.razorpayKey || payInfo?.key_id || payInfo?.keyId;
    const amount = payInfo?.amount || payInfo?.amountInPaise || payInfo?.totalAmount;
    const currency = payInfo?.currency || "INR";
    const razorpayOrderId = payInfo?.razorpayOrderId || payInfo?.razorpay_order_id || payInfo?.orderId;
    const backendOrderId = payInfo?.orderId || createdOrderId;

    if (!key || !amount || !razorpayOrderId) {
      console.error("Payment create returned unexpected payload", createBody);
      throw new Error("Payment initialization failed. Invalid response from server.");
    }

    // 3) open Razorpay as before (same options)
    const options = {
      key,
      amount,
      currency,
      order_id: razorpayOrderId,
      name: "OneAim Store",
      description: "Order Payment",
      handler: async function (response) {
        try {
          const verifyPayload = {
            orderId: backendOrderId,
            razorpayOrderId: response.razorpay_order_id || response.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id || response.razorpayPaymentId,
            razorpaySignature: response.razorpay_signature || response.razorpaySignature,
          };

          const verifyRes = await API.post("/aimdev/api/payment/verify", verifyPayload);
          const verifyBody = verifyRes?.data ?? verifyRes;
          if (verifyBody?.status === "SUCCESS") {
            toast.success("Payment successful");
            const finalOrderId = verifyBody?.data?.orderId || backendOrderId || createdOrderId;
            router.push(`/order-confirmation?orderId=${encodeURIComponent(finalOrderId || "")}`);
          } else {
            console.warn("Verify returned non-success", verifyBody);
            toast.error(verifyBody?.message || "Payment verification failed");
          }
        } catch (err) {
          console.error("Payment verify error", err);
          toast.error("Payment verification error");
        }
      },
      modal: {
        ondismiss: async function () {
          toast.error("Payment cancelled");
          try {
            await API.post("/aimdev/api/payment/cancel", { orderId: createdOrderId });
          } catch (e) { /* ignore */ }
        },
      },
      theme: { color: "#0B74E5" },
    };

    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        toast.error("Failed to load payment gateway");
      };
      document.body.appendChild(script);
    }
  } catch (err) {
    console.error("Place order / payment error:", err);
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Failed to place order";
    toast.error(msg);
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <Link href="/cart" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold">Checkout</h1>

        <nav className="text-sm text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li><Link href="/">Home</Link></li>
            <li>/</li>
            <li className="text-foreground">Checkout</li>
          </ol>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Shipping */}
          {activeStep === "shipping" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" value={shippingInfo.firstName}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })} required />
                    </div>
                    <div><Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" value={shippingInfo.lastName}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })} />
                    </div>
                  </div>

                  <div><Label htmlFor="address">Street address</Label>
                    <Input id="address" value={shippingInfo.address}
                           onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} required />
                  </div>

                  <div><Label htmlFor="apartment">Apartment, suite (optional)</Label>
                    <Input id="apartment" value={shippingInfo.apartment}
                           onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label htmlFor="city">City</Label>
                      <Input id="city" value={shippingInfo.city}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} required />
                    </div>
                    <div><Label htmlFor="state">State</Label>
                      <Input id="state" value={shippingInfo.state}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} />
                    </div>
                    <div><Label htmlFor="zipCode">ZIP / Postal</Label>
                      <Input id="zipCode" value={shippingInfo.zipCode}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="country">Country</Label>
                      <Input id="country" value={shippingInfo.country}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })} />
                    </div>
                    <div><Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={shippingInfo.phone}
                             onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} required />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Payment */}
          {activeStep === "payment" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>Choose payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center justify-between border p-4 rounded">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="ONLINE" id="online" />
                        <div><div className="font-medium">Online Payment</div>
                          <div className="text-sm text-muted-foreground">Pay now using card / gateway</div></div>
                      </div>
                      <div className="text-sm">Recommended</div>
                    </div>

                    <div className="flex items-center justify-between border p-4 rounded">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="COD" id="cod" />
                        <div><div className="font-medium">Cash on Delivery (COD)</div>
                          <div className="text-sm text-muted-foreground">Pay when delivery arrives</div></div>
                      </div>
                      <div className="text-sm">₹ 0 extra</div>
                    </div>
                  </RadioGroup>

                  <div className="pt-4 flex gap-4">
                    <Button variant="outline" onClick={() => setActiveStep("shipping")}>Back</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Continue to Review <ChevronRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Review */}
          {activeStep === "review" && (
            <Card className="mb-6">
              <CardHeader><CardTitle>Review & Place Order</CardTitle><CardDescription>Confirm details</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Shipping</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveStep("shipping")}>Edit</Button>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.address}{shippingInfo.apartment ? `, ${shippingInfo.apartment}` : ""}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="text-sm text-muted-foreground">{shippingInfo.country}</p>
                    <p className="text-sm text-muted-foreground mt-2">Phone: {shippingInfo.phone}</p>
                    <p className="text-sm text-muted-foreground">Email: {shippingInfo.email}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Payment</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveStep("payment")}>Edit</Button>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <p className="font-medium">{paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Items</h3>
                  <div className="space-y-3">
                    {cartLoading ? (<div>Loading items...</div>) :
                      cartItems.length === 0 ? (<div className="text-sm text-muted-foreground">Cart is empty</div>) :
                        cartItems.map((it) => {
                          const id = it.id ?? it.cartId ?? it.productId;
                          const title = it.pname ?? it.name ?? it.title ?? "Product";
                          const img = getImageUrl(it);
                          return (
                            <div key={id} className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-white rounded overflow-hidden flex items-center justify-center">
                                <img src={img} alt={title} className="object-contain w-full h-full p-1" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{title}</div>
                                <div className="text-xs text-muted-foreground">Qty: {it.quantity}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{(Number(it.price || 0) * (it.quantity || 1)).toLocaleString()}</div>
                              </div>
                            </div>
                          );
                        })
                    }
                  </div>
                </div>

                <div>
                  <Button type="button" className="w-full bg-primary hover:bg-primary/90" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Placing order..." : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader><CardTitle className="text-primary">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>₹{tax.toFixed(2)}</span></div>
              </div>

              <Separator className="bg-red-100" />

              <div className="flex justify-between font-bold"><span>Total</span><span className="text-primary">₹{total.toFixed(2)}</span></div>
            </CardContent>
            <CardFooter className="border-t border-red-100 flex flex-col space-y-3">
              <div className="text-sm text-muted-foreground">Secure checkout</div>
              <div className="text-sm text-muted-foreground">Free shipping on orders over ₹5,000</div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
