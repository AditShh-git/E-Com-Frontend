"use client"

import Image from "next/image"
import { Search, Filter, MoreHorizontal, Package, Truck, CheckCircle, Clock, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { getalluserOrder, order_detail_url, invoice_download_url } from "@/constants/backend-urls";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [allOrders, setAllOrders] = useState([])
  const [sellerOrders, setSellerOrders] = useState([]) // seller orders state
  const [currentTab, setCurrentTab] = useState("all-orders")
  const [tk, setTk] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoadingOrderDetails, setIsLoadingOrderDetails] = useState(false);
  const router = useRouter()

  // get token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (token) {
      const parsedToken = JSON.parse(token);
      setTk(parsedToken.state.user.accessToken);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  // fetch all orders
  useEffect(() => {
    if (!tk) return;
  
    
    axios
      .get(getalluserOrder, {
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const orderdata = res.data?.data?.orders || [];
        console.log("All Orders:", orderdata);
        setAllOrders(orderdata);
      })
      .catch((err) => {
        console.error("Error fetching Order Details:", err);
      });
  }, [tk]);

  // fetch seller orders (dummy template - replace with real API later)
  // useEffect(() => {
  //   if (!tk) return;

  //   axios
  //     .get("/api/seller-orders", {
  //       headers: {
  //         Authorization: `Bearer ${tk}`,
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       const sellerData = res.data?.data?.orders || [];
  //       console.log("Seller Orders:", sellerData);
  //       setSellerOrders(sellerData);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching Seller Orders:", err);
  //     });
  // }, [tk]);

  // filters
  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.docId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || order.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const filteredSellerOrders = sellerOrders.filter((order) => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || order.orderStatus?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleViewOrderDetails = async (order) => {
    try {
      setIsLoadingOrderDetails(true);
      const response = await axios.get(order_detail_url(order.docId), {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.data?.status === 'SUCCESS') {
        setSelectedOrder(response.data.data.orderRs);
        setIsOrderModalOpen(true);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details. Please try again.');
    } finally {
      setIsLoadingOrderDetails(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    if (!orderId) {
      toast.error('No order ID provided');
      return;
    }

    try {
      const response = await axios.get(invoice_download_url(orderId), {
        headers: {
          Authorization: `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Important for file downloads
      });

      // Create a blob from the response
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
    <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    <div className="flex-1">
    <div className="space-y-6">
      <header className="bg-white border-b p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-primary">Order Management</h1>
        <p className="text-muted-foreground">Monitor and manage all platform orders</p>
      </header>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-orders">All Orders</TabsTrigger>
          <TabsTrigger value="seller-orders">Orders by Seller</TabsTrigger>
        </TabsList>

        {/* All Orders */}
        <TabsContent value="all-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Platform Orders</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-primary/30 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-primary/30 bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        Status: {filterStatus === "all" ? "All" : filterStatus}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("processing")}>Processing</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("shipped")}>Shipped</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>Delivered</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>Cancelled</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.docId}>
                      <TableCell className="font-medium">{order.docId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.user.userName}</p>
                          <p className="text-xs text-muted-foreground">{order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {order.itemCount} items
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${order.totalAmount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)} className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                      {new Date(order.orderTime).toISOString().split("T")[0]}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrderDetails(order)}>
                              View Order Details
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handleDownloadInvoice(order.docId)}>Generate Invoice</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seller Orders */}
        <TabsContent value="seller-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellerOrders.map((order) => (
                    <TableRow key={`${order.orderId}-${order.productId}`}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={order.sellerAvatar || "/placeholder.svg"}
                              alt={order.sellerName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{order.sellerName}</p>
                            <p className="text-xs text-muted-foreground">{order.sellerEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded border">
                            <Image
                              src={order.productImage || "/placeholder.svg"}
                              alt={order.productName}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-xs text-muted-foreground">SKU: {order.productSku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-medium">${order.amount?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.orderStatus)} className={getStatusColor(order.orderStatus)}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Order Details</DropdownMenuItem>
                            <DropdownMenuItem>Contact Seller</DropdownMenuItem>
                            <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <Button variant="ghost" className="absolute right-4 top-4 h-8 w-8 p-0" onClick={() => setIsOrderModalOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          {isLoadingOrderDetails ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedOrder ? (
            <div className="grid gap-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder.docId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p>{selectedOrder.orderTime ? new Date(selectedOrder.orderTime).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedOrder.orderStatus || 'N/A'}
                  </Badge>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedOrder.user?.userName || 'N/A'}</p>
                    <p className="text-sm">{selectedOrder.user?.email || 'N/A'}</p>
                    <p className="text-sm">{selectedOrder.user?.phoneNo || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Payment Method:</span>
                      <span className="capitalize">{selectedOrder.paymentMethod?.toLowerCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Total Amount:</span>
                      <span className="font-medium">₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-medium text-muted-foreground border-b pb-1">Order Items</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderedItems?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                                {item.imageId ? (
                                  <Image
                                    src={`/api/images/${item.imageId}`}
                                    alt={item.pname}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <Package className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p>{item.pname}</p>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>₹{item.price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>{item.quantity || 1}</TableCell>
                          <TableCell className="text-right">
                            ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="ml-auto w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-₹{selectedOrder.discount?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleDownloadInvoice(selectedOrder.docId)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No order details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </div>
    </div>
  )
}

// ✅ Helper functions for status styling
function getStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "default"
    case "shipped":
    case "processing":
    case "pending":
      return "secondary"
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100"
    case "shipped":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    case "processing":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100"
    default:
      return ""
  }
}

function getStatusIcon(status) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return <CheckCircle className="h-3 w-3 mr-1" />
    case "shipped":
      return <Truck className="h-3 w-3 mr-1" />
    case "processing":
      return <Package className="h-3 w-3 mr-1" />
    case "pending":
      return <Clock className="h-3 w-3 mr-1" />
    default:
      return <Clock className="h-3 w-3 mr-1" />
  }
}
