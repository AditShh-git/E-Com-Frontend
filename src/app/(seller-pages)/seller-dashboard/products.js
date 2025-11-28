"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

import {
  seller_product_list_url,
  seller_delete_product_url,
} from "@/constants/backend-urls";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SellerBlocked from "@/components/ui-components/SellerBlocked";
import { toast } from "sonner";

export default function ProductsPage() {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUnapproved, setIsUnapproved] = useState(false);

  // ------------------------------------------------
  // READ TOKEN
  // ------------------------------------------------
  useEffect(() => {
    const raw = localStorage.getItem("user-storage");
    if (!raw) {
      router.push("/seller-login");
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setToken(parsed?.state?.user?.accessToken || null);
    } catch {
      router.push("/seller-login");
    }
  }, [router]);

  // ------------------------------------------------
  // FETCH PRODUCTS + CHECK APPROVAL
  // ------------------------------------------------
  useEffect(() => {
    if (!token) return;
    checkSellerStatus();
  }, [token]);

  async function checkSellerStatus() {
    try {
      const res = await axios.get(seller_product_list_url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsUnapproved(false);

      const backendProducts = res?.data?.data?.data || [];
      const mapped = backendProducts.map((p) => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        let img =
          p.imageUrls?.length > 0
            ? `${backendUrl}${p.imageUrls[0]}`
            : p.imageFileIds?.length > 0
            ? `${backendUrl}/aimdev/api/files/public/${p.imageFileIds[0]}/view`
            : "/placeholder.svg";

        return {
          docId: p.id,
          pname: p.name,
          price: p.price,
          totalItem: p.stock,
          image: img,
          verified: p.seller?.verified || false,
          soldItem: p.soldItem ?? 0,
        };
      });

      setProducts(mapped);
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (err.response?.status === 403 || msg.includes("pending admin approval")) {
        setIsUnapproved(true);
      }
    }

    setLoading(false);
  }

  // ------------------------------------------------
  // DELETE PRODUCT
  // ------------------------------------------------
  const handleDelete = async (docId, name) => {
    if (!confirm(`Delete "${name}"?`)) return;

    if (isUnapproved) return;

    try {
      const res = await axios.delete(seller_delete_product_url(docId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "SUCCESS") {
        setProducts((prev) => prev.filter((p) => p.docId !== docId));
        toast.success("Product deleted");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="relative">
      {/* 🔥 FULLSCREEN BLOCK POPUP */}
      {isUnapproved && <SellerBlocked />}

      <div className={`space-y-6 p-6 ${isUnapproved ? "pointer-events-none opacity-20" : ""}`}>
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Products</h2>

          <Button
            disabled={isUnapproved}
            onClick={() => router.push("/seller-dashboard/add-product")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." className="pl-10 w-80" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Inventory</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.docId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 border rounded overflow-hidden bg-white">
                        <Image
                          src={p.image}
                          alt={p.pname}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="font-medium">{p.pname}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {p.verified ? "Verified" : "Not Verified"}
                    </span>
                  </TableCell>

                  <TableCell>{p.totalItem}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell>{p.soldItem}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/seller-dashboard/edit-product/${p.docId}`)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleDelete(p.docId, p.pname)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
