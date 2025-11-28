export function normalizeProduct(p) {
  if (!p) return null;

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL; 
  // Example: http://localhost:8989

  // Product list returns: "/api/files/public/352/view"
  let raw = null;

  if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
    raw = p.imageUrls[0];  
  }

  // Fallback to other fields if needed
  if (!raw) {
    raw =
      p.imageUrl ||
      p.productImageUrl ||
      p.thumbnail ||
      p.image ||
      p.imagePath ||
      "/placeholder.svg";
  }

  // Build final URL correctly
  let finalImageUrl;

  if (raw.startsWith("/api/")) {
    // must prepend /aimdev
    finalImageUrl = `${backend}/aimdev${raw}`;
  } else if (raw.startsWith("http")) {
    finalImageUrl = raw;
  } else {
    finalImageUrl = `${backend}${raw}`;
  }

  return {
    id: p.id || p.docId || p.productId || null,
    slug: p.slug || null,
    name: p.name || "Unknown",
    description: p.description || null,
    price: p.price || 0,
    imageUrl: finalImageUrl,
    shareMessage: p.shareMessage || null,
  };
}
