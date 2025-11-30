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

// NEW POP-UP COMPONENT
import ConfirmDialog from "@/components/ui-components/ConfirmDialog";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  // 🎯 Popup States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(""); // "activate" or "deactivate"

  useEffect(() => {
    loadProducts(showInactive);
  }, [showInactive]);

  async function loadProducts(show) {
    const res = await getSellerProducts(show);
    const backendProducts = res?.data?.data || [];
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
    setLoading(false);
  }

  // 📌 Open Popup
  const openDialog = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setDialogOpen(true);
  };

  // 📌 Close Popup
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
    setActionType("");
  };

  // 📌 When user confirms popup action
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
      } else {
        toast.error("Failed to deactivate");
      }
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
      } else {
        toast.error("Failed to activate");
      }
    }

    closeDialog();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      {/* ======================= */}
      {/* CONFIRM POPUP DIALOG */}
      {/* ======================= */}
      <ConfirmDialog
        open={dialogOpen}
        title={
          actionType === "deactivate"
            ? "Deactivate Product"
            : "Activate Product"
        }
        description={
          selectedProduct
            ? `Are you sure you want to ${
                actionType === "deactivate" ? "deactivate" : "activate"
              } "${selectedProduct.pname}"?`
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
                        router.push(
                          `/seller-dashboard/edit-product/${p.docId}`
                        )
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
