"use client";

import { useState, useEffect } from "react";
import { Search, MoreHorizontal, Filter } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import { getStatusUI } from "@/utils/order-status";
import { getalluserOrder, invoice_download_url } from "@/constants/backend-urls";

/* ======================= INVOICE PREVIEW MODAL ======================= */
function InvoicePreviewModal({ open, setOpen, blob }) {
  if (!open || !blob) return null;
  const url = URL.createObjectURL(blob);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[90%] rounded-xl shadow-xl overflow-hidden relative">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 bg-red-600 text-white px-4 py-1 rounded-md"
        >
          Close
        </button>
        <iframe src={url} className="w-full h-full" />
      </div>
    </div>
  );
}

/* ================================ PAGE ================================ */

export default function AdminOrders() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");

  const [orders, setOrders] = useState([]);

  // Pagination + Sorting + Filter
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState("orderTime");
  const [direction, setDirection] = useState("desc");
  const [status, setStatus] = useState("");

  const [totalPages, setTotalPages] = useState(1);

  // Admin Token
  const [tk, setTk] = useState(null);

  // Invoice Preview
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewBlob, setPreviewBlob] = useState(null);

  /* ------------------------ LOAD ADMIN TOKEN ------------------------ */
  useEffect(() => {
    const storage = localStorage.getItem("user-storage");
    if (!storage) return router.push("/admin/login");

    const parsed = JSON.parse(storage);
    const accessToken = parsed?.state?.user?.accessToken;

    if (!accessToken) return router.push("/admin/login");

    setTk(accessToken);
  }, []);

  /* ------------------------- LOAD ORDERS (API) ------------------------- */
  useEffect(() => {
    if (!tk) return;

    axios
      .get(
        `${getalluserOrder}?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}&status=${status}`,
        {
          headers: { Authorization: `Bearer ${tk}` },
        }
      )
      .then((res) => {
        const data = res.data?.data?.data;

        setOrders(data?.orders || []);
        setTotalPages(data?.totalPages || 1);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load orders");
      });
  }, [tk, page, sortBy, direction, status]);

  /* ------------------------------ SEARCH ------------------------------ */
  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.docId.toLowerCase().includes(q) ||
      o.user?.userName?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q)
    );
  });

  /* --------------------- INVOICE ACTIONS ---------------------- */
  const handlePreviewInvoice = async (orderId) => {
    try {
      const res = await axios.get(invoice_download_url(orderId), {
        headers: { Authorization: `Bearer ${tk}` },
        responseType: "blob",
      });

      setPreviewBlob(res.data);
      setPreviewOpen(true);
    } catch {
      toast.error("Failed to preview invoice");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await axios.get(invoice_download_url(orderId), {
        headers: { Authorization: `Bearer ${tk}` },
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  /* ============================= UI ============================= */

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4 rounded-lg mb-4 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Order Management</h1>
          <p className="text-muted-foreground">View & manage customer orders</p>
        </header>

        {/* CARD */}
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">

              <span>All Orders</span>

              {/* SEARCH */}
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-3 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardTitle>

            {/* FILTERS BAR */}
            <div className="flex gap-3 mt-4 items-center">

              {/* SORT DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter size={16} className="mr-2" /> Sort: {sortBy}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>

                  <DropdownMenuItem onClick={() => setSortBy("orderTime")}>
                    Order Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("totalAmount")}>
                    Total Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* DIRECTION */}
              <Button
                variant="secondary"
                onClick={() => setDirection(direction === "desc" ? "asc" : "desc")}
              >
                {direction.toUpperCase()}
              </Button>

              {/* STATUS DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Status: {status || "ALL"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatus("")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus("INITIAL")}>
                    INITIAL
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus("SHIPPED")}>
                    SHIPPED
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatus("DELIVERED")}>
                    DELIVERED
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </CardHeader>

          <CardContent>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((o) => {
                  const { label, className, Icon } = getStatusUI(o.status);

                  return (
                    <TableRow key={o.docId}>
                      <TableCell className="font-mono">{o.docId}</TableCell>

                      <TableCell>
                        <p className="font-medium">{o.user?.userName}</p>
                        <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                      </TableCell>

                      <TableCell>{o.itemCount}</TableCell>
                      <TableCell>₹{o.totalAmount}</TableCell>

                      <TableCell>
                        <span className={className}>
                          <Icon size={14} className="mr-1" /> {label}
                        </span>
                      </TableCell>

                      <TableCell>
                        {new Date(o.orderTime).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreviewInvoice(o.docId)}>
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadInvoice(o.docId)}>
                              Download Invoice
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4">
              <Button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                variant="outline"
              >
                Prev
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <Button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage(page + 1)}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <InvoicePreviewModal
        open={previewOpen}
        setOpen={setPreviewOpen}
        blob={previewBlob}
      />
    </div>
  );
}
