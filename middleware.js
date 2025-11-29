// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const url = req.nextUrl.clone();
//   const pathname = req.nextUrl.pathname;

//   // Protect admin routes only
//   const adminRoutes = [
//     "/admin/dashboard",
//     "/admin/users",
//     "/admin/sellers",
//     "/admin/products",
//     "/admin/orders",
//     "/admin/analytics",
//     "/admin/settings",
//   ];

//   // Read AUTH TOKEN from cookies (not zustand)
//   const adminToken = req.cookies.get("admin-token")?.value || null;

//   if (adminRoutes.some((route) => pathname.startsWith(route))) {
//     if (!adminToken) {
//       url.pathname = "/admin/login";
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
