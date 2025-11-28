"use client";

import { use } from "react";
import { useState, useEffect } from "react";

import ProductForm from "../../product-form";
import axios from "axios";

import {
  seller_update_product_url,
  seller_upload_image_url,
  seller_product_list_url,
  seller_delete_single_image_url,
} from "@/constants/backend-urls";

import { getToken } from "@/utils/sellerApi";
import SellerBlocked from "@/components/ui-components/SellerBlocked";

export default function EditProductPage({ params }) {
  const { id } = use(params);

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    fetchCategories();
    loadProduct();
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

  const loadProduct = async () => {
    try {
      const token = getToken();

      const res = await axios.get(seller_product_list_url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const p = res.data.data.data.find((x) => x.id == id);

      const existingImages = (p.imageFileIds || []).map((imgId) => ({
        imageId: imgId,
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/files/public/${imgId}/view`,
      }));

      setProduct({
        docId: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        categoryId: p.categoryId,
        customCategoryName: "",
        newImages: [],
        existingImages,
        onDeleteImage: handleDeleteImage,
      });

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

  const handleDeleteImage = async (imageId) => {
    const token = getToken();

    try {
      await axios.delete(seller_delete_single_image_url(id, imageId), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProduct((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter((x) => x.imageId !== imageId),
      }));
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) setBlocked(true);
    }
  };

  const handleSubmit = async (form) => {
    const token = getToken();

    try {
      const fd = new FormData();
      fd.append("docId", form.docId);
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);

      if (form.categoryId !== "custom") {
        fd.append("categoryId", form.categoryId);
      } else {
        fd.append("customCategoryName", form.customCategoryName);
      }

      await axios.put(seller_update_product_url, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (form.newImages?.length > 0) {
        const imgData = new FormData();
        form.newImages.forEach((f) => imgData.append("files", f));

        await axios.post(seller_upload_image_url(form.docId), imgData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Product updated!");
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

  if (!product) return <p className="p-6">Loading…</p>;

  return (
    <>
      {blocked && <SellerBlocked />}

      <ProductForm
        mode="edit"
        initial={product}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </>
  );
}
