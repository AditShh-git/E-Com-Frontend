// src/services/product-service.js
import API from "@/utils/consumerApi";
import { consumer_product_list_url } from "@/constants/backend-urls";

export const productService = {
  getProducts: async (params = {}) => {
    // params optional (e.g., ?page=1&pageSize=20), we'll let API handle query strings if passed externally
    const res = await API.get(consumer_product_list_url, { params });
    // Try common shapes, prefer array of products
    return (
      res?.data?.data?.products ||
      res?.data?.data?.data ||
      res?.data?.data ||
      res?.data ||
      []
    );
  },

  getProductById: async (id) => {
    // Backend may expose a product detail endpoint; try one common pattern first
    try {
      const res = await API.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/public/product/${id}`);
      return res?.data?.data || res?.data || null;
    } catch (e) {
      // fallback: fetch list and find item
      const list = await productService.getProducts();
      return list.find((p) => p.docId == id || p.id == id || p.productId == id) || null;
    }
  },
};
