"use client";

import ProductForm from "../product-form";
import axios from "axios";
import { seller_add_product_url } from "@/constants/backend-urls";
import { getToken } from "@/utils/sellerApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);

  const emptyProduct = {
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    customCategoryName: "",
    newImages: [],
    existingImages: [],
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/admin/category/active`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      const data = await res.json();
      setCategories(data.data?.data || []);
    } catch {}
  };

  const handleSubmit = async (form) => {
    console.log("ADD-PRODUCT HANDLE SUBMIT ✔");

    const token = getToken();

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);

      if (form.categoryId === "custom") {
        fd.append("customCategoryName", form.customCategoryName);
      } else {
        fd.append("categoryId", form.categoryId);
      }

      if (form.newImages?.length > 0) {
        form.newImages.forEach((file) => fd.append("images", file));
      }

      await axios.post(seller_add_product_url, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ⭐ Toast instead of alert
      toast.success("Product created successfully!");

      setTimeout(() => {
        window.location.href = "/seller-dashboard?tab=products";
      }, 1000);

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      toast.error("Error creating product");
    }
  };

  return (
    <ProductForm
      mode="add"
      initial={emptyProduct}
      categories={categories}
      onSubmit={handleSubmit}
    />
  );
}
