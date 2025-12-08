"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Truck, Calendar, Package, Download, Eye } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<p>Loading order...</p>}>
      <OrderConfirmationDetails />
    </Suspense>
  );
}

function OrderConfirmationDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [invoicePreviewUrl, setInvoicePreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Calculate delivery date (7–10 days)
  const calculateDeliveryDate = () => {
    const today = new Date();
    const min = new Date(today);
    const max = new Date(today);

    min.setDate(min.getDate() + 7);
    max.setDate(max.getDate() + 10);

    return `${min.toLocaleDateString()} - ${max.toLocaleDateString()}`;
  };

  useEffect(() => {
    if (!orderId) return;

    setOrder({
      id: orderId,
      date: new Date().toLocaleDateString(),
      status: "Processing",
      deliveryEstimate: calculateDeliveryDate(),
    });
  }, [orderId]);

  if (!order) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p>Loading order details...</p>
      </div>
    );
  }

  // Get JWT token
  const getToken = () => {
  try {
    const data = JSON.parse(localStorage.getItem("user-storage"))?.state;
    return data?.token || null;
  } catch {
    return null;
  }
};


  // --- DOWNLOAD INVOICE ---
  const downloadInvoice = async () => {
    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/invoice/download/${orderId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${orderId}-invoice.pdf`;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Failed to download invoice");
    }
  };

  // --- PREVIEW INVOICE ---
  const previewInvoice = async () => {
    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/invoice/download/${orderId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Preview load failed");

      const blob = await res.blob();
      const fileUrl = window.URL.createObjectURL(blob);

      setInvoicePreviewUrl(fileUrl);
      setShowPreview(true);
    } catch (err) {
      alert("Unable to preview invoice");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-primary">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Your order <b>#{order.id}</b> has been successfully placed.
        </p>
      </div>

      {/* Order Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Placed on: {order.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <span>Status: {order.status}</span>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <span>
              Estimated Delivery: <b>{order.deliveryEstimate}</b>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons (ICON ONLY) */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={previewInvoice}
          className="p-3 rounded-full bg-primary text-white shadow hover:bg-primary/90"
        >
          <Eye className="h-5 w-5" />
        </button>

        <button
          onClick={downloadInvoice}
          className="p-3 rounded-full border shadow hover:bg-gray-100"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white w-[90%] h-[90%] rounded shadow-xl p-4 relative">
            <button
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => setShowPreview(false)}
            >
              Close
            </button>

            <iframe
              src={invoicePreviewUrl}
              className="w-full h-full rounded"
              title="Invoice Preview"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
