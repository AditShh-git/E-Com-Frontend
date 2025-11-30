// ======================================================
// sellerApi.js — FINAL & CORRECTED VERSION
// ======================================================

// BACKEND ROOT (NO /aimdev here)
const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

const TOKEN_KEY = "seller-auth";

console.log("SELLER API BASE_URL =", BASE_URL);

// ------------------------------------------------------
// CORRECT TOKEN READER
// ------------------------------------------------------
export function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return (
      parsed?.state?.user?.accessToken ||
      parsed?.state?.seller?.accessToken ||
      parsed?.state?.token ||
      parsed?.token ||
      null
    );
  } catch {
    return null;
  }
}

// ------------------------------------------------------
// Inject Authorization header
// ------------------------------------------------------
function injectAuthHeaders(headers = {}) {
  const token = getToken();

  console.log("TOKEN SENT =", token);

  return token
    ? { ...headers, Authorization: `Bearer ${token}` }
    : { ...headers };
}

// ------------------------------------------------------
// SAFE FETCH
// ------------------------------------------------------
export async function safeFetch(url, options = {}) {
  const mergedHeaders = injectAuthHeaders(options.headers || {});
  console.log("REQUEST →", url, mergedHeaders);

  try {
    const res = await fetch(url, {
      ...options,
      headers: mergedHeaders,
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { status: "ERROR", raw: text, statusCode: res.status };
    }
  } catch (err) {
    return { status: "ERROR", message: err.message };
  }
}

// ------------------------------------------------------
// PUBLIC FILES
// ------------------------------------------------------
export const PUBLIC_FILE_URL = `${BASE_URL}/aimdev/api/files/public`;

// =======================================================
// SELLER DASHBOARD / ANALYTICS
// =======================================================
export async function getSellerOverview() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/dashboard/overview`, {
    method: "GET",
  });
}

export async function getSellerAnalyticsOverview() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/analytics`, {
    method: "GET",
  });
}

export async function getSellerSalesTrend() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/analytics/charts/sales`, {
    method: "GET",
  });
}

export async function getSellerTopProducts() {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/analytics/reports/products`, {
    method: "GET",
  });
}

// =======================================================
// SELLER PRODUCTS
// =======================================================
export async function getSellerProducts(showInactive = false) {
  return safeFetch(
    `${BASE_URL}/aimdev/api/seller/product/list?showInactive=${showInactive}`,
    { method: "GET" }
  );
}

export async function addSellerProduct(formData) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/add`, {
    method: "POST",
    body: formData,
  });
}

export async function updateSellerProduct(formData) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/update`, {
    method: "PUT",
    body: formData,
  });
}

export async function deleteSellerProduct(id) {
  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/${id}`, {
    method: "DELETE",
  });
}

export async function uploadProductImages(productId, files = []) {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f));

  return safeFetch(`${BASE_URL}/aimdev/api/seller/product/${productId}/images`, {
    method: "POST",
    body: fd,
  });
}

export async function deleteProductImage(productId, imageId) {
  return safeFetch(
    `${BASE_URL}/aimdev/api/seller/product/${productId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}

// EXPORT ALL
export default {
  getToken,
  safeFetch,
  PUBLIC_FILE_URL,

  getSellerOverview,
  getSellerAnalyticsOverview,
  getSellerSalesTrend,
  getSellerTopProducts,

  getSellerProducts,
  addSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  uploadProductImages,
  deleteProductImage,
};
