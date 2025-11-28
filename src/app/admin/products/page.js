"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { Search, Edit, Check, X, Eye } from "lucide-react";
import {
  get_carts_admin_url,
  cart_save_url,
  file_img_url,
} from "@/constants/backend-urls";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editForm, setEditForm] = useState({
    enabled: false,
    varified: false,
  });
const [tk, setTk] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (token) {
      const parsedToken = JSON.parse(token);
      setTk(parsedToken.state.user.accessToken);
    } else {
      alert("Please Login");
      router.push("/admin/login");
    }
  }, [router]);
  // Authentication check
  // Fetch products
  const fetchProducts = async () => {
    if (!tk) return;

    try {
      setLoading(true);
      const response = await axios.get(get_carts_admin_url, {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      });

      console.log("Products response:", response.data);

      if (response.data?.status === "SUCCESS") {
        setProducts(response.data.data.carts || []);
        setFilteredProducts(response.data.data.carts || []);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tk) {
      fetchProducts();
    }
  }, [tk]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search functionality
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.pname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller?.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      enabled: product.enabled,
      varified: product.varified,
    });
    setIsEditModalOpen(true);
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value === "true",
    }));
  };

  // Save product changes
  const handleSaveChanges = async () => {
    if (!tk || !editingProduct) return;

    try {
      setLoading(true);

      const updatedProduct = {
        ...editingProduct,
        enabled: editForm.enabled,
        varified: editForm.varified,
      };

      const response = await axios.post(cart_save_url, updatedProduct, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
      });

      console.log("Update response:", response.data);

      if (response.data?.status === "SUCCESS") {
        // Update the product in local state
        setProducts((prev) =>
          prev.map((product) =>
            product.docId === editingProduct.docId
              ? { ...product, enabled: editForm.enabled, varified: editForm.varified }
              : product
          )
        );

        toast.success("Product updated successfully");
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } else {
        throw new Error(response.data?.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to update product"
      );
    } finally {
      setLoading(false);
    }
  };

  // Get status badge class
  const getStatusBadge = (varified) => {
    if (varified === true) return "bg-green-100 text-green-800";
    if (varified === false) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Get enabled badge class
  const getEnabledBadge = (enabled) => {
    return enabled ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
    <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    <div className="flex-1">
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Product Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, sellers, categories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Total Products: {filteredProducts.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Seller/Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.docId} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                          {product.imageId ? (
                            <Image
                              src={file_img_url(product.imageId)}
                              alt={product.pname}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.pname}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {product.docId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">${product.price}</p>
                        {product.offer > 0 && (
                          <p className="text-sm text-green-600">
                            -{product.offer}% off
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">
                        {product.category || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>Stock: {product.totalItem}</p>
                        <p className="text-sm text-muted-foreground">
                          Sold: {product.soldItem}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.seller ? (
                        <div>
                          <p className="text-sm font-medium">
                            {product.seller.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">Seller</p>
                        </div>
                      ) : product.vendor ? (
                        <div>
                          <p className="text-sm font-medium">
                            {product.vendor.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">Vendor</p>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          product.varified
                        )}`}
                      >
                        {product.varified ? "Verified" : "Not Verified"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getEnabledBadge(
                          product.enabled
                        )}`}
                      >
                        {product.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="h-8"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product Status</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{editingProduct.pname}</h3>
                <p className="text-sm text-muted-foreground">
                  ID: {editingProduct.docId}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="enabled">Enabled Status</Label>
                  <Select
                    value={editForm.enabled.toString()}
                    onValueChange={(value) => handleFormChange("enabled", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="varified">Verification Status</Label>
                  <Select
                    value={editForm.varified.toString()}
                    onValueChange={(value) => handleFormChange("varified", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Verified</SelectItem>
                      <SelectItem value="false">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </div>
  );
};

export default ProductsPage;
