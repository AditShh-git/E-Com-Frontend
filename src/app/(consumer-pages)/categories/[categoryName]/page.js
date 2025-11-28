"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Filter, ShoppingBag, Star, Grid, List, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { carts_list_url, carts_by_category_url, order_save_url } from "@/constants/backend-urls"
import axios from "axios"

export default function CategoryPage({ params }) {
  const { categoryName } = use(params)
  const decodedCategoryName = decodeURIComponent(categoryName)
  const categoryTitle = decodedCategoryName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  // Helper function to convert category name to API format
  const formatCategoryForAPI = (category) => {
    return category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')
  }

  // Helper function to convert API format back to display format
  const formatCategoryForDisplay = (category) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  // State for filters and products
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortOption, setSortOption] = useState("popularity")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [tk, setTk] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(categoryTitle)

  // Get token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("user-storage")
    if (token) {
      try {
        const parsedToken = JSON.parse(token)
        const accessToken = parsedToken?.state?.user?.accessToken
        setTk(accessToken)
      } catch (error) {
        console.error('Error parsing token:', error)
      }
    }
  }, [])

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (!tk) return
      
      try {
        const response = await axios.get(carts_list_url, {
          headers: {
            Authorization: `Bearer ${tk}`,
            "Content-Type": "application/json",
          },
        })
        
        if (response.status === 200) {
          const result = response.data
          if (result.status === "SUCCESS" && result.data?.carts) {
            // Extract unique categories from the cart data
            const uniqueCategories = [...new Set(result.data.carts.map(item => item.category).filter(Boolean))]
            setCategories(uniqueCategories)
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }
    
    fetchCategories()
  }, [tk])

  // Fetch products by selected category (not just URL category)
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!tk || !selectedCategory) return
      
      setLoading(true)
      try {
        const apiCategory = formatCategoryForAPI(selectedCategory)
        console.log('Fetching products for category:', selectedCategory, 'API format:', apiCategory, 'with token:', tk)
        const response = await axios.get(carts_by_category_url(apiCategory), {
          headers: {
            Authorization: `Bearer ${tk}`,
            "Content-Type": "application/json",
          },
        })
        
        console.log('Category Products API Response:', response.data)
        
        if (response.status === 200 && response.data) {
          const result = response.data
          if (result.status === "SUCCESS" && result.data?.carts) {
            console.log('Products carts data:', result.data.carts)
            setProducts(result.data.carts)
          } else {
            console.log('No products found or invalid response structure')
            setProducts([])
          }
        } else {
          console.log('API call failed with status:', response.status)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching category products:', error)
        toast.error('Failed to load products')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [selectedCategory, tk])

  // Update selected category when URL parameter changes
  useEffect(() => {
    setSelectedCategory(categoryTitle)
  }, [categoryTitle])

  // Filter products based on the current category and filters
  useEffect(() => {
    console.log('Filtering products. Raw products:', products)
    console.log('Price range:', priceRange)
    
    let result = [...products]

    // Apply price range filter
    result = result.filter((product) => {
      // Calculate actual selling price (price - offer)
      const originalPrice = product.price || 0
      const offer = product.offer || 0
      const sellingPrice = originalPrice - offer
      
      console.log(`Product: ${product.pname}, Original: ${originalPrice}, Offer: ${offer}, Selling: ${sellingPrice}`)
      
      return sellingPrice >= priceRange[0] && sellingPrice <= priceRange[1]
    })

    console.log('After price filter:', result.length, 'products')

    // Apply sorting
    if (sortOption === "price-low") {
      result.sort((a, b) => {
        const priceA = (a.price || 0) - (a.offer || 0)
        const priceB = (b.price || 0) - (b.offer || 0)
        return priceA - priceB
      })
    } else if (sortOption === "price-high") {
      result.sort((a, b) => {
        const priceA = (a.price || 0) - (a.offer || 0)
        const priceB = (b.price || 0) - (b.offer || 0)
        return priceB - priceA
      })
    } else if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    } else {
      // Default: popularity (by sold items)
      result.sort((a, b) => (b.soldItem || 0) - (a.soldItem || 0))
    }

    console.log('Filtered products result:', result)
    setFilteredProducts(result)
  }, [products, priceRange, sortOption])

  // Add to cart function
  const addToCart = async (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.docId === product.docId)
      if (existingItem) {
        return prev.map((item) => (item.docId === product.docId ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prev, { ...product, quantity: 1 }]
      }
    })

    toast.success("Added to cart", {
      description: `${product.pname} has been added to your cart`,
    })

    // Example function to POST order data
    const orderData = {
      paymentMethod: "",
      totalCarts: {
        [product.id]: product.name // Example, adjust as needed
      },
      fullName: "mohan",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: ""
    }

    try {
      const response = await fetch(order_save_url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })
      const result = await response.json()
      console.log("Order saved:", result)
    } catch (error) {
      console.error("Error saving order:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-primary">{categoryTitle}</h1>

        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categories" className="hover:text-primary">
                Categories
              </Link>
            </li>
            <li>/</li>
            <li className="text-primary">{categoryTitle}</li>
          </ol>
        </nav>

        {/* Filters and Sort - Mobile */}
        <div className="flex lg:hidden items-center justify-between mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Narrow down products to find exactly what you&apos;re looking for.</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <MobileFilters
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("popularity")}>Popularity</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("price-low")}>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("price-high")}>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "grid" ? "bg-muted" : ""}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={viewMode === "list" ? "bg-muted" : ""}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  Categories
                </h3>
                <div className="space-y-2">
                  {[...new Set(categories)].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategory === formatCategoryForDisplay(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategory(formatCategoryForDisplay(category))
                            // Navigate to the selected category
                            window.location.href = `/categories/${formatCategoryForAPI(category)}`
                          }
                        }}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {formatCategoryForDisplay(category)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h3>
                <div className="space-y-4">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={50000}
                      min={0}
                      step={100}
                      className="mb-4"
                    />
                    <div className="flex items-center gap-2 text-sm">
                      <span>${priceRange[0]}</span>
                      <span>-</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Sort and View Options - Desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products in{" "}
                <span className="font-medium text-primary">{categoryTitle}</span>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      Sort by: <span className="font-medium capitalize">{sortOption.replace("-", " to ")}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOption("popularity")}>Popularity</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("price-low")}>Price: Low to High</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("price-high")}>Price: High to Low</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest First</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={viewMode === "grid" ? "bg-muted" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={viewMode === "list" ? "bg-muted" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.docId} product={product} addToCart={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListItem key={product.docId} product={product} addToCart={addToCart} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or check out our other categories.
                </p>
                <Button className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary text-white hover:bg-primary/90">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ProductCard component
function ProductCard({ product, addToCart }) {
  const productName = product.pname || product.name || product.title || 'Unnamed Product'
  const productPrice = product.price || 0
  const productImage = product.imageId ? `/api/images/${product.imageId}` : "/placeholder.svg"
  const productRating = 4.5 // Default rating since not provided in API
  const productReviews = product.soldItem || 0
  const productSeller = 'OneAim Store' // Default seller since not provided in API
  const productOffer = product.offer || 0
  const discountedPrice = productPrice - productOffer
  const discountPercentage = productOffer > 0 ? Math.round((productOffer / productPrice) * 100) : null

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-red-100 hover:border-primary">
      <div className="relative h-48 bg-white">
        <Image src={productImage} alt={productName} fill className="object-contain p-4" />
        {discountPercentage && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{productRating}</span>
          <span className="text-xs text-muted-foreground">({productReviews} sold)</span>
        </div>
        <Link href={`/products/${product.docId}`}>
          <h3 className="font-semibold hover:text-primary transition-colors">{productName}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-2">{productSeller}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {productOffer > 0 ? (
              <>
                <span className="font-bold text-primary">${discountedPrice.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm line-through">${productPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="font-bold text-primary">${productPrice.toLocaleString()}</span>
            )}
          </div>
          <Button 
            size="sm"
            variant="default"
            className="bg-primary hover:bg-primary/90"
            onClick={() => addToCart(product)}
            disabled={!product.enabled}
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Stock: {product.totalItem - product.soldItem} available
        </div>
      </CardContent>
    </Card>
  )
}

// ProductListItem component
function ProductListItem({ product, addToCart }) {
  const productName = product.pname || product.name || product.title || 'Unnamed Product'
  const productPrice = product.price || 0
  const productImage = product.imageId ? `/api/images/${product.imageId}` : "/placeholder.svg"
  const productRating = 4.5 // Default rating since not provided in API
  const productReviews = product.soldItem || 0
  const productSeller = 'OneAim Store' // Default seller since not provided in API
  
  const productOffer = product.offer || 0
  const discountedPrice = productOffer


  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-red-100 hover:border-primary">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-48">
          <Image
            src={productImage}
            alt={productName}
            fill
            className="object-contain p-4 bg-white"
          />
          {productOffer && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              {productOffer}% OFF
            </div>
          )}
          
        </div>
        <CardContent className="flex-1 p-4">
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{productRating}</span>
            <span className="text-xs text-muted-foreground">({productReviews} sold)</span>
          </div>
          <Link href={`/products/${product.docId}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors">{productName}</h3>
          </Link>
         
         
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {productOffer > 0 ? (
                <>
                  <span className="font-bold text-primary text-lg">${discountedPrice.toLocaleString()}</span>
                  <span className="text-muted-foreground text-sm line-through">${productPrice.toLocaleString()}</span>
                </>
              ) : (
                <span className="font-bold text-primary text-lg">${productPrice.toLocaleString()}</span>
              )}
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              onClick={() => addToCart(product)}
              disabled={!product.enabled}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Stock: {product.totalItem - product.soldItem} available
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

// DesktopFilters component
function DesktopFilters({ priceRange, setPriceRange }) {
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          min={0}
          step={100}
          className="mb-4"
        />
        <div className="flex items-center gap-2 text-sm">
          <span>${priceRange[0]}</span>
          <span>-</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}

// MobileFilters component
function MobileFilters({ priceRange, setPriceRange }) {
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="font-medium text-primary">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          min={0}
          step={100}
          className="mb-4"
        />
        <div className="flex items-center gap-2 text-sm">
          <span>${priceRange[0]}</span>
          <span>-</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}
