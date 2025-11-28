// src/utils/sellerApi.js
// ======================================================
// FINAL WORKING VERSION (ADD / EDIT / DELETE PRODUCT)
// ======================================================

console.log("SELLER API BASE_URL =", process.env.NEXT_PUBLIC_BACKEND_URL);

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const TOKEN_KEY = "user-storage";

// ======================================================
// TOKEN (EXPORTED ✔)
// ======================================================
export function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.state?.user?.accessToken || null;
  } catch {
    return null;
  }
}

// ======================================================
// AUTH HEADERS
// ======================================================
function authHeaders(extra = {}) {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
}

// ======================================================
// SAFE FETCH (ALWAYS RETURNS JSON)
// ======================================================
export async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return { status: "ERROR", raw: text };
    }
  } catch (err) {
    return { status: "ERROR", message: err.message };
  }
}

// ======================================================
// PUBLIC FILE URL FOR IMAGES
// ======================================================
export const PUBLIC_FILE_URL = `${BASE_URL}/api/files/public`;



// ======================================================
// SELLER PRODUCT APIs (ADD / EDIT / DELETE)
// ======================================================

// GET ALL SELLER PRODUCTS
export async function getSellerProducts() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/list`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

// ADD PRODUCT
export async function addSellerProduct(formData) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/add`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
}

// UPDATE PRODUCT
export async function updateSellerProduct(formData) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/update`, {
    method: "PUT",
    headers: authHeaders(),
    body: formData,
  });
}

// DELETE PRODUCT
export async function deleteSellerProduct(id) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/${id}`, {
    method: "DELETE",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

// DELETE A SINGLE IMAGE
export async function deleteProductImage(productId, imageId) {
  return safeFetch(
    `${BASE_URL}/aimdev/api/seller/product/${productId}/images/${imageId}`,
    {
      method: "DELETE",
      headers: authHeaders({ "Content-Type": "application/json" }),
    }
  );
}

// UPLOAD IMAGES (MULTIPLE)
export async function uploadProductImages(productId, images) {
  const fd = new FormData();
  images.forEach((file) => fd.append("files", file));

  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/${productId}/images`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
}



// ======================================================
// SELLER DASHBOARD / ANALYTICS
// ======================================================

export async function getSellerOverview() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/dashboard/overview`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

export async function getSellerAnalyticsOverview() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/analytics`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

export async function getSellerSalesTrend() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/analytics/charts/sales`, {
    method: "GET",
    headers: authHeaders({ "Content-Type": "application/json" }),
  });
}

export async function getSellerTopProducts() {
  return safeFetch(
    `${BASE_URL}/aimdev/api/seller/analytics/reports/products`,
    {
      method: "GET",
      headers: authHeaders({ "Content-Type": "application/json" }),
    }
  );
}



// ======================================================
// DEFAULT EXPORT
// ======================================================
export default {
  getToken,
  safeFetch,

  // product actions
  getSellerProducts,
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  deleteProductImage,
  uploadProductImages,

  // analytics
  getSellerOverview,
  getSellerAnalyticsOverview,
  getSellerSalesTrend,
  getSellerTopProducts,
};
