"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CategorySidebar({ currentCategory }) {
  const [expandedCategories, setExpandedCategories] = useState({
    electronics: true,
    fashion: false,
    "home-garden": false,
    "digital-services": false,
    "sports-outdoors": false,
  })

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-4 space-y-6">
        <div className="bg-white rounded-lg border border-red-100 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <h3 className="font-medium text-primary">Categories</h3>
          </div>
          <div className="p-2">
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                        currentCategory === category.name ? "bg-primary text-white" : "hover:bg-red-50 text-foreground",
                      )}
                      onClick={() => toggleCategory(category.slug)}
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className={cn("flex-1", currentCategory === category.name ? "text-white" : "")}
                      >
                        {category.name}
                      </Link>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <button className="focus:outline-none">
                          {expandedCategories[category.slug] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {category.subcategories && expandedCategories[category.slug] && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory.id}>
                            <Link
                              href={`/categories/${category.slug}?subcategory=${subcategory.slug}`}
                              className={cn(
                                "block px-3 py-1.5 rounded-md text-sm",
                                currentCategory === subcategory.name
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "hover:bg-red-50",
                              )}
                            >
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-white rounded-lg border border-red-100 overflow-hidden">
          <div className="p-4 bg-red-50 border-b border-red-100">
            <h3 className="font-medium text-primary">Featured</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <Link href="/products/new-arrivals" className="block p-2 hover:bg-red-50 rounded-md transition-colors">
                New Arrivals
              </Link>
              <Link href="/products/sale" className="block p-2 hover:bg-red-50 rounded-md transition-colors">
                Sale Items
              </Link>
              <Link href="/products/best-sellers" className="block p-2 hover:bg-red-50 rounded-md transition-colors">
                Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sample data
const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    subcategories: [
      { id: 101, name: "Smartphones", slug: "smartphones" },
      { id: 102, name: "Laptops", slug: "laptops" },
      { id: 103, name: "Audio", slug: "audio" },
      { id: 104, name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: 2,
    name: "Home & Garden",
    slug: "home-garden",
    subcategories: [
      { id: 201, name: "Furniture", slug: "furniture" },
      { id: 202, name: "Decor", slug: "decor" },
      { id: 203, name: "Kitchen", slug: "kitchen" },
      { id: 204, name: "Garden", slug: "garden" },
    ],
  },
  {
    id: 3,
    name: "Fashion",
    slug: "fashion",
    subcategories: [
      { id: 301, name: "Men's Clothing", slug: "mens-clothing" },
      { id: 302, name: "Women's Clothing", slug: "womens-clothing" },
      { id: 303, name: "Shoes", slug: "shoes" },
      { id: 304, name: "Accessories", slug: "accessories" },
    ],
  },
  {
    id: 4,
    name: "Digital Services",
    slug: "digital-services",
    subcategories: [
      { id: 401, name: "Web Development", slug: "web-development" },
      { id: 402, name: "Graphic Design", slug: "graphic-design" },
      { id: 403, name: "Marketing", slug: "marketing" },
    ],
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    subcategories: [
      { id: 501, name: "Fitness", slug: "fitness" },
      { id: 502, name: "Camping", slug: "camping" },
      { id: 503, name: "Sports Equipment", slug: "sports-equipment" },
    ],
  },
]
