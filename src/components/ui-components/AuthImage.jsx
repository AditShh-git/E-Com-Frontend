"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";

import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Download,
} from "lucide-react";

import AdminSidebar from "@/components/ui-components/admin-sidebar";
import SellerImage from "@/components/ui-components/seller-image";
import AuthImage from "@/components/ui-components/AuthImage";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { toast } from "sonner";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function AdminSellers() {
  const [activeTab, setActiveTab] = useState("sellers");
  const [search, setSearch] = useState("");
  const [rawQuery, setRawQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const [sellers, setSellers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loadingAction, setLoadingAction] = useState({});
  const debounceRef = useRef(null);

  // ----------------------------
  // TOKEN LOAD
  // ----------------------------
  useEffect(() => {
    const storage = localStorage.getItem("user-storage");
    if (!storage) return;
    try {
      const parsed = JSON.parse(storage);
      setToken(parsed.state.user.accessToken);
    } catch {
      toast.error("Invalid login data");
    }
  }, []);

  // ----------------------------
  // LOAD SELLERS
  // ----------------------------
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const [unv, ver] = await Promise.all([
          axios.get(`${BASE}/api/admin/settings/seller/unverified`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE}/api/admin/settings/seller/verified`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const normalize = (s) => ({
          docId: s.docId,
          sellerId: s.sellerId,
          fullName: s.userName,
          email: s.email,
          phoneNo: s.phoneNo,
          gst: s.gst,
          aadhaar: s.adhaar,
          pan: s.panCard,
          imageUrl: s.imageUrl,
          verified: s.verified,
          rejected: s.rejected,
          raw: s
        });

        const combined = [
          ...(unv.data?.sellers || []).map(normalize),
          ...(ver.data?.sellers || []).map(normalize)
        ];

        setSellers(combined);
      } catch (err) {
        toast.error("Failed loading sellers");
      }
    };

    load();
  }, [token]);

  // ----------------------------
  // DEBOUNCED SEARCH
  // ----------------------------
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(rawQuery.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [rawQuery]);

  // ----------------------------
  // BUILD IMAGE URL WITHOUT DOUBLE /aimdev
  // ----------------------------
  const buildImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${BASE}${imageUrl}`;
  };

  // ----------------------------
  // STATUS DECISION
  // ----------------------------
  const sellersWithStatus = useMemo(() =>
    sellers.map((s) => {
      let status = "pending";
      if (s.verified) status = "verified";
      if (s.rejected) status = "rejected";
      return { ...s, status };
    }), [sellers]);

  // ----------------------------
  // FILTER + SEARCH
  // ----------------------------
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sellersWithStatus.filter((s) => {
      const matchesFilter = filter === "all" ? true : s.status === filter;
      const matchesQuery =
        !q ||
        s.fullName?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.sellerId?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [sellersWithStatus, filter, search]);

  // ----------------------------
  // PAGINATION
  // ----------------------------
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ----------------------------
  // VERIFY ACTION
  // ----------------------------
  const handleVerify = async (docId, sellerId, doApprove) => {
    if (!token) return;

    setLoadingAction((p) => ({ ...p, [docId]: doApprove ? "approve" : "reject" }));

    // OPTIMISTIC UPDATE
    setSellers((prev) =>
      prev.map((s) =>
        s.docId === docId
          ? { ...s, verified: doApprove, rejected: !doApprove }
          : s
      )
    );

    try {
      const res = await axios.post(
        `${BASE}/api/admin/settings/seller/verify`,
        null,
        {
          params: { sellerId, status: doApprove },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data);
    } catch {
      toast.error("Failed updating seller");
    } finally {
      setLoadingAction((p) => {
        const c = { ...p };
        delete c[docId];
        return c;
      });
    }
  };

  // ----------------------------
  // DOWNLOAD DOCUMENTS
  // ----------------------------
  const handleDownloadDocs = async (seller) => {
    if (!token) return;

    const id = seller.docId;
    setLoadingAction((p) => ({ ...p, [id]: "downloading" }));

    try {
      const resp = await axios.get(
        `${BASE}/api/admin/seller/${seller.sellerId}/documents`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `seller-${seller.sellerId}-docs.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success("Downloaded documents");
    } catch {
      toast.error("Failed to download");
    } finally {
      setLoadingAction((p) => {
        const c = { ...p };
        delete c[id];
        return c;
      });
    }
  };

  // ----------------------------
  // UI
  
   return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">Seller Verification</h1>
          <p className="text-muted-foreground">Review & take actions on seller applications</p>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Seller Applications</CardTitle>
                  <p className="text-sm text-muted-foreground">Total: {total}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 sm:flex-none max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search sellers..."
                      value={rawQuery}
                      onChange={(e) => setRawQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Filter */}
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex gap-2">
                      {["all", "verified", "pending", "rejected"].map((f) => (
                        <button
                          key={f}
                          onClick={() => {
                            setFilter(f);
                            setPage(1);
                          }}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                            filter === f
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" /> {filter}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["all", "verified", "pending", "rejected"].map((f) => (
                          <DropdownMenuItem
                            key={f}
                            onClick={() => {
                              setFilter(f);
                              setPage(1);
                            }}
                          >
                            {f}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageData.map((s) => (
                      <TableRow
                        key={s.docId}
                        className={`transition-transform duration-200 ${
                          loadingAction[s.docId] ? "opacity-80 scale-98" : "hover:scale-[1.01]"
                        }`}
                      >
                        {/* Image */}
                        <TableCell>
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            {s.imageUrl ? (
                              <AuthImage
                                src={buildImageUrl(s.imageUrl)}
                                token={token}
                                alt={s.fullName}
                                className="w-full h-full object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <SellerImage imageId={null} width={40} height={40} />
                            )}
                          </div>
                        </TableCell>

                        {/* Seller Info */}
                        <TableCell>
                          <p className="font-medium">{s.fullName}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                          <p className="text-xs text-muted-foreground">{s.sellerId}</p>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            className={
                              s.status === "verified"
                                ? "bg-green-100 text-green-700"
                                : s.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }
                          >
                            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                          </Badge>
                        </TableCell>

                        {/* Created At */}
                        <TableCell>
                          <p className="text-sm text-muted-foreground">
                            {s.raw?.createdAt
                              ? new Date(s.raw.createdAt).toLocaleString()
                              : "-"}
                          </p>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">

                            {/* Review Modal */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelected(s)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Seller Details</DialogTitle>
                                  <DialogDescription>
                                    Review the seller before approving.
                                  </DialogDescription>
                                </DialogHeader>

                                {selected && selected.docId === s.docId && (
                                  <SellerDetailsModal
                                    seller={selected}
                                    onVerify={handleVerify}
                                    onDownload={handleDownloadDocs}
                                    loadingAction={loadingAction}
                                    buildImageUrl={buildImageUrl}
                                    token={token}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>

                            {/* More Menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!s.verified && (
                                  <DropdownMenuItem
                                    onClick={() => handleVerify(s.docId, s.sellerId, true)}
                                    className="text-green-600 flex items-center gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4" /> Approve
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() => handleVerify(s.docId, s.sellerId, false)}
                                  className="text-red-600 flex items-center gap-2"
                                >
                                  <XCircle className="h-4 w-4" /> Reject
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDownloadDocs(s)}
                                  className="flex items-center gap-2"
                                >
                                  <Download className="h-4 w-4" /> Download Documents
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {pageData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          No sellers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1} –{" "}
                    {Math.min(page * pageSize, total)} of {total}
                  </p>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="ml-3 px-2 py-1 border rounded"
                  >
                    {[5, 10, 20, 50].map((n) => (
                      <option key={n} value={n}>
                        {n} / page
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Prev
                  </Button>

                  <div className="flex items-center gap-1">
                    {renderPageNumbers(page, totalPages, setPage)}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

/* PAGE NUMBERS */
function renderPageNumbers(current, totalPages, setPage) {
  const pages = [];
  const maxButtons = 7;

  let start = Math.max(1, current - Math.floor(maxButtons / 2));
  let end = start + maxButtons - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  if (start > 1) pages.push(pageButton(1, current, setPage));
  if (start > 2) pages.push(<span key="dots-start">...</span>);

  for (let i = start; i <= end; i++) {
    pages.push(pageButton(i, current, setPage));
  }

  if (end < totalPages - 1) pages.push(<span key="dots-end">...</span>);
  if (end < totalPages) pages.push(pageButton(totalPages, current, setPage));

  return pages;
}

function pageButton(i, current, setPage) {
  return (
    <button
      key={i}
      onClick={() => setPage(i)}
      className={`px-3 py-1 rounded ${
        i === current ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {i}
    </button>
  );
}

/* SELLER DETAILS MODAL */
function SellerDetailsModal({ seller, onVerify, onDownload, loadingAction, buildImageUrl, token }) {
  if (!seller) return null;

  const isLoading = !!loadingAction[seller.docId];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        {seller.imageUrl ? (
          <AuthImage
            src={buildImageUrl(seller.imageUrl)}
            token={token}
            alt={seller.fullName}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <SellerImage imageId={null} width={128} height={128} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-medium">{seller.fullName}</p>

          <p className="text-sm text-muted-foreground mt-3">Email</p>
          <p>{seller.email}</p>

          <p className="text-sm text-muted-foreground mt-3">Phone</p>
          <p>{seller.phoneNo}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Seller ID</p>
          <p>{seller.sellerId}</p>

          <p className="text-sm text-muted-foreground mt-3">GST</p>
          <p>{seller.gst || "-"}</p>

          <p className="text-sm text-muted-foreground mt-3">PAN / Aadhaar</p>
          <p>{seller.pan || "-"} / {seller.aadhaar || "-"}</p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="destructive"
          onClick={() => onVerify(seller.docId, seller.sellerId, false)}
          disabled={isLoading}
        >
          {isLoading && loadingAction[seller.docId] === "reject"
            ? "Rejecting..."
            : "Reject"}
        </Button>

        {!seller.verified && (
          <Button
            className="bg-primary"
            onClick={() => onVerify(seller.docId, seller.sellerId, true)}
            disabled={isLoading}
          >
            {isLoading && loadingAction[seller.docId] === "approve"
              ? "Approving..."
              : "Approve"}
          </Button>
        )}

        <Button
          onClick={() => onDownload(seller)}
          disabled={isLoading}
        >
          {isLoading && loadingAction[seller.docId] === "downloading"
            ? "Downloading..."
            : "Download Docs"}
        </Button>
      </div>
    </div>
  );
}
