"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

import {
  getSellerProducts,
  deleteSellerProduct,
  updateSellerProduct,
} from "@/utils/sellerApi";

import ConfirmDialog from "@/components/ui-components/ConfirmDialog";
import { useSellerStore } from "@/store/seller-store";

export default function ProductsPage() {
  const router = useRouter();

  // Get fresh seller from Zustand
  const seller = useSellerStore((s) => s.seller);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const [blocked, setBlocked] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState("");

  /* ==========================================================
     ACCESS CHECK — BLOCK ONLY IF REAL UNVERIFIED SELLER
  ========================================================== */

  useEffect(() => {
    if (!seller) return;

    console.log("Seller in ProductsPage:", seller);

    if (seller.emailVerified !== true) {
      setBlocked(true);
      setLoading(false);
      return;
    }

    if (seller.verified !== true) {
      setBlocked(true);
      setLoading(false);
      return;
    }

    if (seller.locked === true) {
      setBlocked(true);
      setLoading(false);
      return;
    }

    // Verified & Approved Seller → load products
    loadProducts(showInactive);
  }, [seller, showInactive]);

  /* ==========================================================
     LOAD PRODUCTS
  ========================================================== */
  async function loadProducts(show) {
  try {
    const res = await getSellerProducts(show);

    if (res.status !== "SUCCESS") {
      toast.error("Failed to load products");
      return;
    }

    console.log("PRODUCT LIST RESPONSE:", res);

    // 💥 CORRECT EXTRACTION
    const backendProducts =
      res?.data?.data?.data ||
      res?.data?.data ||
      [];

    const base = process.env.NEXT_PUBLIC_BACKEND_URL;

    const mapped = backendProducts.map((p) => {
      let img = "/placeholder.svg";

      if (Array.isArray(p.imageFileIds) && p.imageFileIds.length > 0) {
        img = `${base}/aimdev/api/files/public/${p.imageFileIds[0]}/view`;
      }

      return {
        docId: p.id,
        pname: p.name,
        price: p.price,
        totalItem: p.stock,
        soldItem: p.soldItem ?? 0,
        active: p.active,
        image: img,
      };
    });

    setProducts(mapped);

  } catch (err) {
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
}


  /* ==========================================================
     DIALOG HANDLERS
  ========================================================== */
  const openDialog = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setActionType("");
  };

  const handleConfirmAction = async () => {
    if (!selectedProduct) return;

    const id = selectedProduct.docId;

    if (actionType === "deactivate") {
      const res = await deleteSellerProduct(id);

      if (res?.status === "SUCCESS") {
        setProducts((prev) =>
          prev.map((p) =>
            p.docId === id ? { ...p, active: false } : p
          )
        );
        toast.success("Product deactivated");
      } else toast.error("Failed to deactivate");
    }

    if (actionType === "activate") {
      const fd = new FormData();
      fd.append("docId", id);
      fd.append("active", "true");

      const res = await updateSellerProduct(fd);

      if (res?.status === "SUCCESS") {
        setProducts((prev) =>
          prev.map((p) =>
            p.docId === id ? { ...p, active: true } : p
          )
        );
        toast.success("Product activated");
      } else toast.error("Failed to activate");
    }

    closeDialog();
  };

  /* ==========================================================
     ACCESS BLOCK UI
  ========================================================== */

  if (blocked) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
          <h2 className="text-xl font-bold text-red-600">Access Restricted</h2>

          {seller?.emailVerified !== true && (
            <p className="mt-3 text-gray-700">
              Please verify your email to access Products.
            </p>
          )}

          {seller?.emailVerified === true && seller?.verified !== true && (
            <p className="mt-3 text-gray-700">
              Your seller account is <b>not approved by Admin</b>.
            </p>
          )}

          {seller?.locked === true && (
            <p className="mt-3 text-gray-700">
              Your account is <b>locked by Admin</b>.
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN UI
  ========================================================== */

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      {/* Dialog */}
      <ConfirmDialog
        open={dialogOpen}
        title={
          actionType === "deactivate" ? "Deactivate Product" : "Activate Product"
        }
        description={
          selectedProduct
            ? `Are you sure you want to ${actionType} "${selectedProduct.pname}"?`
            : ""
        }
        confirmText={actionType === "deactivate" ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        onCancel={closeDialog}
      />

      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Products</h2>

          <div className="flex gap-3">
            <Button onClick={() => setShowInactive((prev) => !prev)}>
              {showInactive ? "Show Only Active" : "Show All Products"}
            </Button>

            <Button onClick={() => router.push("/seller-dashboard/add-product")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Product Table */}
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
                      <div className="relative w-10 h-10 border rounded overflow-hidden">
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
                    {p.active ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </TableCell>

                  <TableCell>{p.totalItem}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell>{p.soldItem}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/seller-dashboard/edit-product/${p.docId}`)
                      }
                    >
                      Edit
                    </Button>

                    {p.active ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => openDialog(p, "deactivate")}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600"
                        onClick={() => openDialog(p, "activate")}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      </div>
    </>
  );
}
