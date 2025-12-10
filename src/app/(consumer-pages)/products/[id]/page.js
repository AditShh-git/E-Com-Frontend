"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";

/* ===========================
   ✅ BACKEND IMPORTS DISABLED
=========================== */
/*
import {
  getFrequentlyBoughtTogether,
  getPeopleAlsoBought,
  getTrending,
  getRecommendedForUser,
  getTopByCategory,
} from "@/services/recommend-service";

import API from "@/utils/consumerApi";
import { normalizeProduct } from "@/utils/normalize-product";
*/

export default function ProductDetailPage({ params }) {
  const { id: productId } = use(params);

  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  /* ===========================
     ❌ BACKEND PRODUCT API DISABLED
  =========================== */
  /*
  const loadProduct = async () => {
    try {
      const res = await API.get(`/aimdev/api/public/product/${productId}`);
      const normalized = normalizeProduct(res.data?.data?.product);
      setProduct(normalized);
    } catch (e) {
      console.error("Product error", e);
    }
  };
  */

  /* ✅ FRONTEND MOCK PRODUCT */
  const loadProduct = () => {
    setProduct({
      name: "Performance Running Shoes",
      description:
        "Engineered for speed and comfort, these running shoes feature a responsive midsole and breathable upper for optimal performance.",
      imageUrl:
        "/placeholder.svg",
      details: {
        Material: "Mesh upper, synthetic overlays",
        Sole: "Rubber",
        Closure: "Lace-up",
        Weight: "250g",
      },
    });
  };

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* LEFT IMAGE */}
      <div className="bg-white p-6 rounded shadow">
        <div className="relative h-96">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="lg:col-span-2">
        {/* Breadcrumb */}
        <p className="text-sm text-muted-foreground mb-4">
          Home / Shop / Performance Running Shoes
        </p>

        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-muted-foreground mb-6">{product.description}</p>

        {/* Product Details */}
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-4">Product Details</h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            {Object.entries(product.details).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b py-2">
                <span className="text-muted-foreground">{key}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS */}
        <div className="border-t mt-8 pt-4">
          <h2 className="font-semibold mb-4">Reviews</h2>

          <div className="flex items-start gap-10 mb-6">
            <div>
              <div className="text-3xl font-bold">4.5</div>
              <div className="text-red-500">★★★★☆</div>
              <div className="text-xs text-muted-foreground">120 reviews</div>
            </div>

            <div className="space-y-2 w-full">
              {[5, 4, 3, 2, 1].map((r, i) => (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <span>{r}</span>
                  <div className="w-full bg-red-100 h-2 rounded">
                    <div
                      className="bg-red-500 h-2 rounded"
                      style={{ width: `${40 - i * 7}%` }}
                    />
                  </div>
                  <span>{40 - i * 7}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            <Review
              name="Liam Walker"
              date="2023-08-15"
              stars={5}
              text="These shoes are amazing! They're so comfortable and really help me push my limits during my runs."
            />
            <Review
              name="Chloe Turner"
              date="2023-07-22"
              stars={4}
              text="Great shoes overall. Lightweight and provide good support."
            />
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-10">
          <h2 className="font-semibold mb-4">Related Products</h2>

          <div className="grid grid-cols-3 gap-4">
            {related.map((p) => (
              <div key={p.title} className="border p-3 rounded shadow-sm">
                <div className="relative h-40">
                  <Image src={p.image} alt={p.title} fill unoptimized className="object-contain" />
                </div>
                <h3 className="font-medium mt-2 text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* REVIEW COMPONENT */
function Review({ name, date, stars, text }) {
  return (
    <div className="border-b pb-4">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground">{date}</span>
      </div>
      <div className="text-red-500 text-sm">
        {"★".repeat(stars)}{"☆".repeat(5 - stars)}
      </div>
      <p className="text-sm mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}

/* RELATED PRODUCTS MOCK */
const related = [
  {
    title: "Lightweight Training Shoes",
    subtitle: "Designed for daily training",
    image: "/placeholder.svg",
  },
  {
    title: "Trail Running Shoes",
    subtitle: "Perfect for off-road",
    image: "/placeholder.svg",
  },
  {
    title: "Marathon Racing Shoes",
    subtitle: "For your next big race",
    image: "/placeholder.svg",
  },
];
