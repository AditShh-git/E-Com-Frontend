"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  getFrequentlyBoughtTogether,
  getPeopleAlsoBought,
  getTrending,
  getRecommendedForUser,
  getTopByCategory,
} from "@/services/recommend-service";

import API from "@/utils/consumerApi";
import { normalizeProduct } from "@/utils/normalize-product";

export default function ProductDetailPage({ params }) {
  const { id: productId } = use(params);

  const [product, setProduct] = useState(null);
  const [fbt, setFbt] = useState([]);
  const [pab, setPab] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [categoryTop, setCategoryTop] = useState([]);

  useEffect(() => {
    loadProduct();
    loadAllSections();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const res = await API.get(`/aimdev/api/public/product/${productId}`);
      const normalized = normalizeProduct(res.data?.data?.product);
      setProduct(normalized);
    } catch (e) {
      console.error("Product error", e);
    }
  };

  const loadAllSections = async () => {
    try {
      const f1 = await getFrequentlyBoughtTogether(productId);
      setFbt(f1.data.data.data);

      const f2 = await getPeopleAlsoBought(productId);
      setPab(f2.data.data.data);

      const f3 = await getTrending();
      setTrending(f3.data.data.data);

      const f4 = await getRecommendedForUser().catch(() => null);
      setRecommended(f4?.data?.data?.data || []);

      const f5 = await getTopByCategory("Electronics");
      setCategoryTop(f5.data.data.data);
    } catch (e) {
      console.log("Recommend error", e);
    }
  };

  if (!product) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="bg-white p-6 rounded shadow">
        <div className="relative h-96 bg-white">
          <Image
            src={product.imageUrl}       // 👈 FIXED — now always correct
            alt={product.name}
            fill
            unoptimized
            sizes="100vw"
            className="object-contain p-6"
          />
        </div>

        <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
        <p className="text-muted-foreground mt-2">{product.description}</p>
      </div>

      {/* SECTIONS */}
      {fbt.length > 0 && <Section title="Frequently bought together" products={fbt} />}
      {pab.length > 0 && <Section title="People also bought" products={pab} />}
      {trending.length > 0 && <Section title="Trending Products" products={trending} />}
      {recommended.length > 0 && <Section title="Recommended for you" products={recommended} />}
      {categoryTop.length > 0 && <Section title="Top in category" products={categoryTop} />}
    </div>
  );
}

function Section({ title, products }) {
  return (
    <div className="my-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.productId} className="border p-4 rounded">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-primary">₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
