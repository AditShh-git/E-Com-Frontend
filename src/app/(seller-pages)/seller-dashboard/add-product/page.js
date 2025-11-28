"use client";

import ProductForm from "../product-form";
import axios from "axios";
import { seller_add_product_url } from "@/constants/backend-urls";
import { getToken } from "@/utils/sellerApi";
import { useEffect, useState } from "react";

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
    console.log("ADD-PRODUCT HANDLE SUBMIT FIRED ✔");

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

      const createRes = await axios.post(seller_add_product_url, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product created successfully!");
      window.location.href = "/seller-dashboard?tab=products";

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      alert("Error creating product");
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
