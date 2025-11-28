"use client";

import ProductForm from "../product-form";
import axios from "axios";
import { seller_add_product_url, seller_product_list_url } from "@/constants/backend-urls";
import { getToken } from "@/utils/sellerApi";
import { useEffect, useState } from "react";
import SellerBlocked from "@/components/ui-components/SellerBlocked";

export default function AddProductPage() {
  const [categories, setCategories] = useState([]);
  const [blocked, setBlocked] = useState(false);

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
    checkSellerStatus();   // <-- ✔ REQUIRED
    fetchCategories();
  }, []);

  async function checkSellerStatus() {
    const token = getToken();

    try {
      await axios.get(seller_product_list_url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlocked(false);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        setBlocked(true);
      }
    }
  }

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

      const productId = createRes?.data?.data?.product?.docId;
      if (!productId) return;

      alert("Product created successfully!");
      window.location.href = "/seller-dashboard?tab=products";

    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "";

      if (status === 403 || msg.includes("pending admin approval")) {
        setBlocked(true);
        return;
      }

      console.error(err);
    }
  };

  return (
    <>
      {blocked && <SellerBlocked />}

      <ProductForm
        mode="add"
        initial={emptyProduct}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </>
  );
}
