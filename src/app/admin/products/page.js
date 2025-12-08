"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { Search, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";
const API_PREFIX = `${BASE}/aimdev`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Paging & Sorting
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState("desc");

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Build full image URL
  const imageSrc = (relative) => `${API_PREFIX}${relative}`;

  // Fetch ADMIN PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const tk =
        JSON.parse(localStorage.getItem("user-storage"))?.state?.user?.accessToken;

      const res = await axios.get(
        `${API_PREFIX}/api/admin/product/list?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`,
        {
          headers: { Authorization: `Bearer ${tk}` },
        }
      );

      const data = res.data?.data?.data;
      setProducts(data?.products || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, direction]);

  // Search filter
  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      (p.categoryName || "").toLowerCase().includes(q) ||
      (p.sellerName || "").toLowerCase().includes(q)
    );
  });

  // Sort toggle
  const toggleSort = (key) => {
    if (sortBy === key) {
      setDirection(direction === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setDirection("asc");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      if (!confirm("Delete this product?")) return;

      const tk =
        JSON.parse(localStorage.getItem("user-storage"))?.state?.user?.accessToken;

      const res = await axios.delete(`${API_PREFIX}/api/seller/product/${id}`, {
        headers: { Authorization: `Bearer ${tk}` },
      });

      if (res.data?.status === "SUCCESS") {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar activeTab="products" />

      <main className="flex-1 p-8">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  className="pl-8 border rounded-md w-full py-2"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Table */}
        <Card className="mt-5">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => toggleSort("name")}>
                    Product <ArrowUpDown className="inline w-4 h-4 ml-1" />
                  </TableHead>

                  <TableHead onClick={() => toggleSort("price")}>
                    Price <ArrowUpDown className="inline w-4 h-4 ml-1" />
                  </TableHead>

                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>

                  <TableHead>
                    Seller (ID)
                  </TableHead>

                  <TableHead>Images</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.productId} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded border overflow-hidden bg-gray-100">
                          {p.imageUrls?.length > 0 ? (
                            <Image
                              src={imageSrc(p.imageUrls[0])}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="text-xs flex items-center justify-center w-full h-full text-gray-500">
                              No Image
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {p.productId}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>{p.categoryName || "N/A"}</TableCell>
                    <TableCell>{p.stock}</TableCell>

                    <TableCell>
                      {p.sellerName || "N/A"}{" "}
                      <span className="text-xs text-gray-500">
                        (ID: {p.sellerId})
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {(p.imageUrls || []).slice(0, 3).map((u) => (
                          <div
                            key={u}
                            className="relative w-8 h-8 border rounded overflow-hidden"
                          >
                            <Image
                              src={imageSrc(u)}
                              alt="img"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteProduct(p.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center mt-5 gap-3">
          <Button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            variant="outline"
          >
            Prev
          </Button>

          <Button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
