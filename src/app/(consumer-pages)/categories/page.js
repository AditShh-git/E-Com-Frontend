import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import CategorySidebar from "./category-sidebar"

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Browse Categories</h1>

      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-primary">Categories</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Sidebar */}
        <CategorySidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md border-red-100 hover:border-primary h-full">
                  <div className="relative h-40">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <h3 className="font-semibold text-lg text-white">{category.name}</h3>
                        <p className="text-white/80 text-sm">{category.count} products</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Browse {category.name} <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Categories Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-primary">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div className="bg-red-50 hover:bg-red-100 transition-colors rounded-lg p-4 text-center">
                    <div className="relative w-12 h-12 mx-auto mb-3">
                      <Image src={category.icon || "/placeholder.svg"} alt={category.name} fill />
                    </div>
                    <h3 className="font-medium text-primary">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} items</p>
                  </div>
                </Link>
              ))}
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
    count: 1243,
    image: "/placeholder.svg?height=400&width=600",
    description: "Discover the latest gadgets, devices, and tech accessories for your digital lifestyle.",
  },
  {
    id: 2,
    name: "Home & Garden",
    slug: "home-garden",
    count: 865,
    image: "/placeholder.svg?height=400&width=600",
    description: "Transform your living space with furniture, decor, and garden essentials.",
  },
  {
    id: 3,
    name: "Fashion",
    slug: "fashion",
    count: 1432,
    image: "/placeholder.svg?height=400&width=600",
    description: "Stay stylish with the latest trends in clothing, shoes, and accessories.",
  },
  {
    id: 4,
    name: "Digital Services",
    slug: "digital-services",
    count: 756,
    image: "/placeholder.svg?height=400&width=600",
    description: "Professional digital solutions for your business and creative needs.",
  },
  {
    id: 5,
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    count: 532,
    image: "/placeholder.svg?height=400&width=600",
    description: "Equipment and gear for all your sports and outdoor adventures.",
  },
  {
    id: 6,
    name: "Beauty & Health",
    slug: "beauty-health",
    count: 978,
    image: "/placeholder.svg?height=400&width=600",
    description: "Skincare, makeup, and wellness products for your self-care routine.",
  },
]

const popularCategories = [
  {
    id: 1,
    name: "Smartphones",
    slug: "electronics",
    count: 432,
    icon: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Laptops",
    slug: "electronics",
    count: 287,
    icon: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Men's Fashion",
    slug: "fashion",
    count: 654,
    icon: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Women's Fashion",
    slug: "fashion",
    count: 778,
    icon: "/placeholder.svg?height=100&width=100",
  },
]
