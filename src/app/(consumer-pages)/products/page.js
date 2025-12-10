"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
// import API from "@/utils/consumerApi";
// import { toast } from "sonner";
import ProductCard from "@/components/ui-components/product-card";
// import { normalizeProduct } from "@/utils/normalize-product";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports & Outdoors",
  ];

  const brands = [
    "TechPro",
    "FashionForward",
    "HomeEssentials",
    "OutdoorGear",
  ];

  const ratings = [
    { label: "4 Stars & Up", value: 4 },
    { label: "3 Stars & Up", value: 3 },
    { label: "2 Stars & Up", value: 2 },
    { label: "1 Star & Up", value: 1 },
  ];

  // ========== BACKEND CONNECTION COMMENTED ==========
  // const fetchProducts = async () => {
  //   try {
  //     // backend final corrected endpoint
  //     const res = await API.get("/aimdev/api/public/product/list");
  //
  //     const list = res?.data?.data?.products || [];
  //
  //     // normalize all products
  //     const normalized = list.map((p) => normalizeProduct(p)).filter(Boolean);
  //
  //     setProducts(normalized);
  //     setFilteredProducts(normalized);
  //   } catch (err) {
  //     console.error("PRODUCT LOAD ERROR:", err);
  //     toast.error("Failed to load products");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // ========== END BACKEND CONNECTION ==========

  // Mock products data for frontend
  const mockProducts = [
    {
      id: 1,
      productId: "PROD-001",
      name: "TechPro Wireless Headphones",
      description: "Immersive sound, noise-canceling",
      price: 199,
      image: "/placeholder.svg",
      category: "Electronics",
      brand: "TechPro",
      rating: 4.5,
    },
    {
      id: 2,
      productId: "PROD-002",
      name: "FashionForward Summer Dress",
      description: "Lightweight, breathable fabric",
      price: 49,
      image: "/placeholder.svg",
      category: "Clothing",
      brand: "FashionForward",
      rating: 4.2,
    },
    {
      id: 3,
      productId: "PROD-003",
      name: "HomeEssentials Smart Blender",
      description: "Powerful motor, multiple settings",
      price: 129,
      image: "/placeholder.svg",
      category: "Home & Kitchen",
      brand: "HomeEssentials",
      rating: 4.7,
    },
    {
      id: 4,
      productId: "PROD-004",
      name: "OutdoorGear Hiking Backpack",
      description: "Durable, water-resistant, 50L capacity",
      price: 89,
      image: "/placeholder.svg",
      category: "Sports & Outdoors",
      brand: "OutdoorGear",
      rating: 4.6,
    },
    {
      id: 5,
      productId: "PROD-005",
      name: "TechPro Smartwatch",
      description: "Fitness tracking, heart rate monitor",
      price: 249,
      image: "/placeholder.svg",
      category: "Electronics",
      brand: "TechPro",
      rating: 4.4,
    },
    {
      id: 6,
      productId: "PROD-006",
      name: "FashionForward Casual Shirt",
      description: "Comfortable, stylish, various colors",
      price: 39,
      image: "/placeholder.svg",
      category: "Clothing",
      brand: "FashionForward",
      rating: 4.0,
    },
    {
      id: 7,
      productId: "PROD-007",
      name: "HomeEssentials Coffee Maker",
      description: "Programmable, automatic shut-off",
      price: 79,
      image: "/placeholder.svg",
      category: "Home & Kitchen",
      brand: "HomeEssentials",
      rating: 4.3,
    },
    {
      id: 8,
      productId: "PROD-008",
      name: "OutdoorGear Camping Tent",
      description: "Spacious, easy setup, sleeps 4",
      price: 149,
      image: "/placeholder.svg",
      category: "Sports & Outdoors",
      brand: "OutdoorGear",
      rating: 4.8,
    },
    {
      id: 9,
      productId: "PROD-009",
      name: "TechPro Bluetooth Speaker",
      description: "Portable, long battery life",
      price: 59,
      image: "/placeholder.svg",
      category: "Electronics",
      brand: "TechPro",
      rating: 4.1,
    },
    {
      id: 10,
      productId: "PROD-010",
      name: "FashionForward Jeans",
      description: "Classic fit, high-quality denim",
      price: 69,
      image: "/placeholder.svg",
      category: "Clothing",
      brand: "FashionForward",
      rating: 4.5,
    },
    {
      id: 11,
      productId: "PROD-011",
      name: "HomeEssentials Vacuum Cleaner",
      description: "Bagless, HEPA filter, strong suction",
      price: 199,
      image: "/placeholder.svg",
      category: "Home & Kitchen",
      brand: "HomeEssentials",
      rating: 4.6,
    },
    {
      id: 12,
      productId: "PROD-012",
      name: "OutdoorGear Fishing Rod",
      description: "Lightweight, durable, sensitive tip",
      price: 99,
      image: "/placeholder.svg",
      category: "Sports & Outdoors",
      brand: "OutdoorGear",
      rating: 4.4,
    },
    {
      id: 13,
      productId: "PROD-013",
      name: "TechPro Laptop Stand",
      description: "Ergonomic, adjustable height",
      price: 45,
      image: "/placeholder.svg",
      category: "Electronics",
      brand: "TechPro",
      rating: 4.2,
    },
    {
      id: 14,
      productId: "PROD-014",
      name: "FashionForward Sneakers",
      description: "Comfortable, trendy design",
      price: 79,
      image: "/placeholder.svg",
      category: "Clothing",
      brand: "FashionForward",
      rating: 4.3,
    },
    {
      id: 15,
      productId: "PROD-015",
      name: "HomeEssentials Air Fryer",
      description: "Healthy cooking, easy to clean",
      price: 119,
      image: "/placeholder.svg",
      category: "Home & Kitchen",
      brand: "HomeEssentials",
      rating: 4.7,
    },
    {
      id: 16,
      productId: "PROD-016",
      name: "OutdoorGear Sleeping Bag",
      description: "Warm, compact, all-season",
      price: 69,
      image: "/placeholder.svg",
      category: "Sports & Outdoors",
      brand: "OutdoorGear",
      rating: 4.5,
    },
    {
      id: 17,
      productId: "PROD-017",
      name: "Best Seller Novel",
      description: "Thrilling mystery story",
      price: 15,
      image: "/placeholder.svg",
      category: "Books",
      brand: "TechPro",
      rating: 4.8,
    },
    {
      id: 18,
      productId: "PROD-018",
      name: "Cooking Masterclass Book",
      description: "Learn chef techniques at home",
      price: 29,
      image: "/placeholder.svg",
      category: "Books",
      brand: "HomeEssentials",
      rating: 4.6,
    },
  ];

  const fetchProducts = () => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      const minRating = Math.min(...selectedRatings);
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }

    // Price filter
    filtered = filtered.filter(
      (p) =>
        (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1]
    );

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, selectedRatings, priceRange, products]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRating = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return <p className="p-10 text-lg font-medium">Loading products...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Shop</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 space-y-8 sticky top-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label
                        htmlFor={category}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Price</span>
                    <span className="text-gray-600">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Brand</h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox
                        id={brand}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <Label
                        htmlFor={brand}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Rating</h3>
                <div className="space-y-3">
                  {ratings.map((rating) => (
                    <div key={rating.value} className="flex items-center">
                      <Checkbox
                        id={`rating-${rating.value}`}
                        checked={selectedRatings.includes(rating.value)}
                        onCheckedChange={() => toggleRating(rating.value)}
                      />
                      <Label
                        htmlFor={`rating-${rating.value}`}
                        className="ml-2 text-sm cursor-pointer"
                      >
                        {rating.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h1 className="text-3xl font-bold">Shop</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-600 text-lg">
                  No products match your filters
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {currentProducts.map((p) => (
                    <ProductCard
                      key={p.id || p.docId || p.productId}
                      product={p}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={page === currentPage ? "default" : "outline"}
                            size="icon"
                            onClick={() => goToPage(page)}
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import API from "@/utils/consumerApi";
// import { toast } from "sonner";
// import ProductCard from "@/components/ui-components/product-card";
// import { normalizeProduct } from "@/utils/normalize-product";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProducts = async () => {
//     try {
//       // backend final corrected endpoint
//       const res = await API.get("/aimdev/api/public/product/list");

//       const list = res?.data?.data?.products || [];

//       // normalize all products
//       const normalized = list.map((p) => normalizeProduct(p)).filter(Boolean);

//       setProducts(normalized);
//     } catch (err) {
//       console.error("PRODUCT LOAD ERROR:", err);
//       toast.error("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   if (loading)
//     return <p className="p-10 text-lg font-medium">Loading products...</p>;

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-6">All Products</h1>

//       {products.length === 0 ? (
//         <p>No products found</p>
//       ) : (
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {products.map((p) => (
//             <ProductCard key={p.id || p.docId || p.productId} product={p} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
