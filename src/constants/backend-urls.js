console.log("BASE_URL =", process.env.NEXT_PUBLIC_BACKEND_URL);

export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* ============================================================
   AUTH (FINAL FIXED PATHS)
============================================================ */

// USER login + signup
export const consumer_signup_url = `${BASE_URL}/aimdev/api/user/signup`;
export const consumer_login_url = `${BASE_URL}/aimdev/api/auth/user/signin`;

// SELLER login + signup
export const seller_signup_url = `${BASE_URL}/aimdev/api/seller/signup`;
export const seller_login_url = `${BASE_URL}/aimdev/api/auth/seller/signin`;

// ADMIN login + signup
export const admin_login_url = `${BASE_URL}/aimdev/api/auth/admin/signin`;
export const admin_signup_url = `${BASE_URL}/aimdev/api/auth/signup/admin`;

// COMMON AUTH ROUTES
export const logout_url = `${BASE_URL}/aimdev/api/auth/logout`;
export const verify_email_url = `${BASE_URL}/aimdev/api/auth/verify-email`;
export const forgot_password_url = `${BASE_URL}/aimdev/api/auth/forgot-password`;
export const reset_password_url = `${BASE_URL}/aimdev/api/auth/reset-password`;

/* ============================================================
   USER ACCOUNT
============================================================ */
export const user_me_url = `${BASE_URL}/aimdev/api/user/me`;
export const update_profile_url = `${BASE_URL}/aimdev/api/user/profile/update`;
export const delete_account_url = `${BASE_URL}/aimdev/api/user/delete/me`;

export const consumer_product_list_url = `${BASE_URL}/aimdev/api/public/product/list`;
export const consumer_cart_my_url = `${BASE_URL}/aimdev/api/cart/my`;

/* ============================================================
   SELLER PRODUCT APIs
============================================================ */
export const seller_product_list_url = `${BASE_URL}/aimdev/api/seller/product/list`;
export const seller_add_product_url = `${BASE_URL}/aimdev/api/seller/product/add`;
export const seller_update_product_url = `${BASE_URL}/aimdev/api/seller/product/update`;

export const seller_delete_product_url = (id) =>
  `${BASE_URL}/aimdev/api/seller/product/${id}`;

export const seller_upload_image_url = (id) =>
  `${BASE_URL}/aimdev/api/seller/product/${id}/images`;

export const seller_delete_single_image_url = (productId, imageId) =>
  `${BASE_URL}/aimdev/api/seller/product/${productId}/images/${imageId}`;

/* PUBLIC FILE VIEW */
export const PUBLIC_FILE_URL = `${BASE_URL}/aimdev/api/files/public`;

/* ============================================================
   SELLER ANALYTICS
============================================================ */
export const seller_overview_url = `${BASE_URL}/aimdev/api/seller/dashboard/overview`;
export const seller_analytics_url = `${BASE_URL}/aimdev/api/seller/analytics`;
export const seller_sales_trend_url = `${BASE_URL}/aimdev/api/seller/analytics/charts/sales`;
export const seller_top_products_url = `${BASE_URL}/aimdev/api/seller/analytics/reports/products`;

/* ============================================================
   WISHLIST
============================================================ */
export const wishlist_save_url = (productId) =>
  `${BASE_URL}/aimdev/api/wishlist/${productId}`;
export const wishlist_get_url = `${BASE_URL}/aimdev/api/wishlist`;
export const wishlist_delete_url = (productId) =>
  `${BASE_URL}/aimdev/api/wishlist/${productId}`;

/* ============================================================
   CART
============================================================ */
export const cart_save_url = `${BASE_URL}/aimdev/api/cart/save`;
export const cart_search_url = `${BASE_URL}/aimdev/api/search`;
export const cart_empty_type_url = `${BASE_URL}/aimdev/api/emptype/carts`;
export const carts_list_url = `${BASE_URL}/aimdev/api/carts`;
export const cart_by_id_url = (id) => `${BASE_URL}/aimdev/api/carts/${id}`;
export const carts_by_category_url = (category) =>
  `${BASE_URL}/aimdev/api/carts/category/${category}`;
export const delete_cart_by_id = (id) =>
  `${BASE_URL}/aimdev/api/delete/cart/${id}`;
export const get_carts_admin_url = `${BASE_URL}/aimdev/api/admin/carts`;

/* ============================================================
   ORDERS
============================================================ */
export const order_save_url = `${BASE_URL}/aimdev/api/order/save`;
export const order_list_url = `${BASE_URL}/aimdev/api/orders`;
export const user_order_list_url = `${BASE_URL}/aimdev/api/orders/user`;
export const order_status_update_url = `${BASE_URL}/aimdev/api/orders/status/update`;
export const order_detail_url = (id) =>
  `${BASE_URL}/aimdev/api/order/${id}`;

/* ============================================================
   PAYMENT
============================================================ */
export const payment_url = `${BASE_URL}/aimdev/api/payment`;
export const create_payment_url = `${BASE_URL}/aimdev/api/auth/createPayment`;
export const get_payment_status_url = `${BASE_URL}/aimdev/api/auth/getPaymentStatus`;

/* ============================================================
   FILE
============================================================ */
export const file_upload_url = `${BASE_URL}/aimdev/api/auth/file/upload`;
export const file_download_url = (fileId) =>
  `${BASE_URL}/aimdev/api/auth/file/${fileId}/download`;
export const file_img_url = (fileId) =>
  `${BASE_URL}/aimdev/api/auth/file/img/${fileId}`;
export const file_delete_url = (fileId) =>
  `${BASE_URL}/aimdev/api/auth/file/${fileId}`;

/* ============================================================
   ADDRESS
============================================================ */
export const address_save_url = `${BASE_URL}/aimdev/api/address/save`;

/* ============================================================
   INVOICE
============================================================ */
export const invoice_download_url = (orderId) =>
  `${BASE_URL}/aimdev/api/invoice/download/${orderId}`;
