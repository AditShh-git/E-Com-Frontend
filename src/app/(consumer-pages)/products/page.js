"use client";

import { useEffect, useState } from "react";
import API from "@/utils/consumerApi";
import { toast } from "sonner";
import ProductCard from "@/components/ui-components/product-card";
import { normalizeProduct } from "@/utils/normalize-product";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      // backend final corrected endpoint
      const res = await API.get("/aimdev/api/public/product/list");

      const list = res?.data?.data?.products || [];

      // normalize all products
      const normalized = list.map((p) => normalizeProduct(p)).filter(Boolean);

      setProducts(normalized);
    } catch (err) {
      console.error("PRODUCT LOAD ERROR:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return <p className="p-10 text-lg font-medium">Loading products...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id || p.docId || p.productId} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
