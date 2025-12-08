"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";

import {
  seller_order_list_url,
  order_detail_url,
  invoice_download_url,
} from "@/constants/backend-urls";

import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/**
 * CLEAN, SAFE Orders page
 * - avoids any extra image requests
 * - cancels stale requests
 * - robust token handling
 */

function StatusBadge({ status }) {
  const map = {
    INITIAL: { label: "Pending", cls: "bg-yellow-100 text-yellow-800" },
    PROCESSING: { label: "Processing", cls: "bg-blue-100 text-blue-800" },
    SHIPPED: { label: "Shipped", cls: "bg-purple-100 text-purple-800" },
    DELIVERED: { label: "Delivered", cls: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-800" },
  };
  const info = map[status] || { label: status || "Unknown", cls: "bg-gray-100 text-gray-800" };
  return <span className={`px-2 py-1 rounded-full text-xs ${info.cls}`}>{info.label}</span>;
}

export default function Orders() {
  const router = useRouter();

  // auth token
  const [tk, setTk] = useState(null);

  // list data & UI state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  // paging / sort / filter
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sortBy, setSortBy] = useState("orderTime");
  const [direction, setDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [q, setQ] = useState("");

  // details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // invoice preview
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceBlobUrl, setInvoiceBlobUrl] = useState(null);
  const invoiceUrlRef = useRef(null);

  // abort controller for list fetches
  const listAbortRef = useRef(null);

  // debounce timer for search
  const searchDebounceRef = useRef(null);

  // ---------------------------
  // token handling
  // ---------------------------
  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (!token) {
      toast.error("Not logged in");
      router.push("/seller-login");
      return;
    }
    try {
      const parsed = JSON.parse(token);
      const access = parsed?.state?.user?.accessToken;
      if (!access) throw new Error("invalid token format");
      setTk(access);
    } catch (e) {
      console.error("token parse error:", e);
      localStorage.removeItem("user-storage");
      router.push("/seller-login");
    }
    // only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // fetch list (with abort)
  // ---------------------------
  const fetchList = useCallback(async (signal) => {
    setLoading(true);
    setListError(null);

    try {
      const params = { page, size, sortBy, direction };
      if (statusFilter) params.status = statusFilter;
      if (q && q.trim()) params.q = q.trim();

      const resp = await axios.get(seller_order_list_url, {
        headers: { Authorization: `Bearer ${tk}` },
        params,
        signal, // modern axios supports AbortController signal
      });

      if (resp.data?.status === "SUCCESS") {
        const payload = resp.data?.data?.data || {};
        setOrders(payload.orders || []);
        setPage(payload.page ?? 0);
        setSize(payload.size ?? size);
        setTotalPages(payload.totalPages ?? 1);
        setTotalElements(payload.totalElements ?? 0);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        // request was cancelled — ignore
        return;
      }
      console.error("fetchList error:", err);
      if (err?.response?.status === 401) {
        // clear and redirect
        localStorage.removeItem("user-storage");
        toast.error("Session expired, please login again");
        router.push("/seller-login");
        return;
      }
      setListError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, size, sortBy, direction, statusFilter, q, tk, router]);

  // run fetch when token or query params change (with debounce for q)
  useEffect(() => {
    if (!tk) return;

    // cancel previous
    if (listAbortRef.current) {
      try { listAbortRef.current.abort(); } catch (e) {}
    }
    const ac = new AbortController();
    listAbortRef.current = ac;

    // debounce search
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      fetchList(ac.signal);
    }, 300);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (listAbortRef.current) {
        try { listAbortRef.current.abort(); } catch (e) {}
        listAbortRef.current = null;
      }
    };
  }, [tk, page, size, sortBy, direction, statusFilter, q, fetchList]);

  // ---------------------------
  // fetch order details
  // ---------------------------
  const fetchOrderDetails = async (orderId) => {
    if (!tk) return;
    setDetailsLoading(true);
    setOrderDetails(null);
    try {
      const resp = await axios.get(order_detail_url(orderId), {
        headers: { Authorization: `Bearer ${tk}` },
      });

      const dto = resp.data?.data?.orderRs || resp.data?.data || null;
      setOrderDetails(dto);
      setIsDetailsOpen(true);
    } catch (err) {
      console.error("fetchOrderDetails error:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("user-storage");
        router.push("/seller-login");
        return;
      }
      toast.error("Failed to load details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const openDetails = (order) => {
    if (!order?.orderId) {
      toast.error("Invalid order");
      return;
    }
    fetchOrderDetails(order.orderId);
  };

  // ---------------------------
  // invoice preview & download
  // ---------------------------
  const previewInvoice = async (orderId) => {
    if (!tk) return;
    setInvoiceLoading(true);
    setInvoiceBlobUrl(null);

    try {
      const resp = await axios.get(invoice_download_url(orderId), {
        headers: { Authorization: `Bearer ${tk}` },
        responseType: "blob",
      });

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // cleanup previous
      if (invoiceUrlRef.current) URL.revokeObjectURL(invoiceUrlRef.current);
      invoiceUrlRef.current = url;

      setInvoiceBlobUrl(url);
      setIsInvoiceOpen(true);
    } catch (err) {
      console.error("previewInvoice error:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("user-storage");
        router.push("/seller-login");
        return;
      }
      toast.error("Cannot preview invoice");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const downloadInvoice = async (orderId) => {
    if (!tk) return;
    try {
      const resp = await axios.get(invoice_download_url(orderId), {
        headers: { Authorization: `Bearer ${tk}` },
        responseType: "blob",
      });

      const blob = new Blob([resp.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded");
    } catch (err) {
      console.error("downloadInvoice error:", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("user-storage");
        router.push("/seller-login");
        return;
      }
      toast.error("Download failed");
    }
  };

  // cleanup invoice blob on unmount
  useEffect(() => {
    return () => {
      if (invoiceUrlRef.current) {
        try { URL.revokeObjectURL(invoiceUrlRef.current); } catch (e) {}
        invoiceUrlRef.current = null;
      }
      if (listAbortRef.current) {
        try { listAbortRef.current.abort(); } catch (e) {}
      }
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  // ---------------------------
  // helpers & rendering
  // ---------------------------
  const formatDateSafe = (d) => {
    try {
      return format(new Date(d), "MMM dd, yyyy hh:mm a");
    } catch {
      return d ?? "";
    }
  };

  if (!tk) return <div className="p-6">Checking session…</div>;
  if (loading) return <div className="p-6">Loading orders…</div>;
  if (listError) return <div className="p-6 text-red-600">{listError}</div>;

  return (
    <TabsContent value="orders" className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Orders</h2>

          <Input
            placeholder="Search order id, product or customer"
            value={q}
            onChange={(e) => {
              setPage(0);
              setQ(e.target.value);
            }}
            className="w-64"
          />

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setPage(0);
              setStatusFilter(v);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="INITIAL">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <label className="text-sm">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setPage(0);
                setSortBy(e.target.value);
              }}
              className="border rounded px-2 py-1"
            >
              <option value="orderTime">Order Time</option>
              <option value="totalAmount">Amount</option>
            </select>

            <button
              className="px-2 py-1 border rounded"
              onClick={() => {
                setPage(0);
                setDirection((d) => (d === "desc" ? "asc" : "desc"));
              }}
              title="Toggle sort direction"
            >
              {direction === "desc" ? "↓" : "↑"}
            </button>
          </div>
        </div>

        <span className="text-sm text-muted-foreground">
          Page {page + 1}/{totalPages} — {totalElements} orders
        </span>
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-2">
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {detailsLoading ? (
            <div className="p-6 text-center">Loading…</div>
          ) : orderDetails ? (
            <div className="space-y-4 p-3">
              <div className="grid md:grid-cols-3 gap-4 bg-muted/20 p-3 rounded">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p>{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p>{formatDateSafe(orderDetails.orderTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge>{orderDetails.orderStatus}</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Customer</h4>
                  <p>{orderDetails.user?.fullName ?? orderDetails.user?.userName}</p>
                  <p className="text-sm">{orderDetails.user?.email}</p>
                  <p className="text-sm">{orderDetails.user?.phoneNo}</p>
                </div>

                <div>
                  <h4 className="font-medium">Payment</h4>
                  <p>{orderDetails.paymentMethod}</p>
                  <p className="font-medium">
                    ₹{Number(orderDetails.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.orderedItems?.map((it, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700">
                              {it.pname?.charAt(0)?.toUpperCase() ?? "?"}
                            </div>
                            <div>
                              <div className="font-medium">{it.pname}</div>
                              <div className="text-xs text-muted-foreground">{it.description}</div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>₹{Number(it.price || 0).toFixed(2)}</TableCell>
                        <TableCell>{it.quantity || 1}</TableCell>
                        <TableCell className="text-right">
                          ₹{Number((it.price || 0) * (it.quantity || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => previewInvoice(orderDetails.orderId)} disabled={invoiceLoading}>
                  <Eye className="h-4 w-4" /> Preview Invoice
                </Button>
                <Button onClick={() => downloadInvoice(orderDetails.orderId)}>
                  <FileText className="h-4 w-4" /> Download Invoice
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">No details</div>
          )}
        </DialogContent>
      </Dialog>

      {/* INVOICE PREVIEW */}
      <Dialog
        open={isInvoiceOpen}
        onOpenChange={(v) => {
          setIsInvoiceOpen(v);
          if (!v && invoiceUrlRef.current) {
            try { URL.revokeObjectURL(invoiceUrlRef.current); } catch (e) {}
            invoiceUrlRef.current = null;
            setInvoiceBlobUrl(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="flex justify-between items-center border-b p-3">
            <h3 className="text-lg font-semibold">Invoice Preview</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  if (invoiceBlobUrl) {
                    const a = document.createElement("a");
                    a.href = invoiceBlobUrl;
                    a.download = "invoice.pdf";
                    a.click();
                  }
                }}
              >
                <FileText className="h-4 w-4" /> Download
              </Button>
              <Button variant="secondary" onClick={() => setIsInvoiceOpen(false)}>
                Close
              </Button>
            </div>
          </div>

          <div className="h-[80vh]">
            {invoiceLoading ? (
              <div className="p-6 text-center">Loading PDF…</div>
            ) : invoiceBlobUrl ? (
              <iframe src={invoiceBlobUrl} className="w-full h-full" />
            ) : (
              <div className="p-6 text-center">No preview</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* TABLE */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.docId}>
                <TableCell className="font-medium">#{o.docId}</TableCell>
                <TableCell>
                  <div className="font-medium">{o.user?.fullName ?? o.user?.userName}</div>
                  <div className="text-sm text-muted-foreground">{o.user?.email}</div>
                </TableCell>

                <TableCell>{formatDateSafe(o.orderTime)}</TableCell>

                <TableCell>
                  {o.orderedItems?.length > 0 ? (
                    <>
                      <span className="font-medium">{o.orderedItems[0].pname}</span>
                      {o.orderedItems.length > 1 && (
                        <span className="text-xs text-muted-foreground block">+{o.orderedItems.length - 1} more</span>
                      )}
                    </>
                  ) : (
                    "No items"
                  )}
                </TableCell>

                <TableCell><StatusBadge status={o.orderStatus} /></TableCell>

                <TableCell className="text-right">₹{Number(o.totalAmount || 0).toLocaleString("en-IN")}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => openDetails(o)}>View</Button>
                  <Button variant="ghost" size="sm" onClick={() => previewInvoice(o.orderId)}>Preview</Button>
                  <Button variant="ghost" size="sm" onClick={() => downloadInvoice(o.orderId)}>Download</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <Button disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Prev</Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <select value={size} onChange={(e) => { setPage(0); setSize(Number(e.target.value)); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <Button disabled={page >= totalPages - 1} onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}>Next</Button>
      </div>
    </TabsContent>
  );
}
