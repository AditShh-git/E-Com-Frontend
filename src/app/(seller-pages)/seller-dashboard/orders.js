"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { user_order_list_url, order_detail_url, invoice_download_url } from "@/constants/backend-urls";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Package } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FileText } from "lucide-react";
import { toast } from "sonner";

function ReadMore({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text) return null;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (text.length <= maxLength) {
    return <p className="text-sm text-muted-foreground">{text}</p>;
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      </p>
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs text-primary hover:no-underline"
        onClick={toggleExpand}
      >
        {isExpanded ? (
          <span className="flex items-center">
            Read Less <ChevronUp className="ml-1 h-3 w-3" />
          </span>
        ) : (
          <span className="flex items-center">
            Read More <ChevronDown className="ml-1 h-3 w-3" />
          </span>
        )}
      </Button>
    </div>
  );
}

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tk, setTk] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken?.state?.user?.accessToken) {
          setTk(parsedToken.state.user.accessToken);
        } else {
          throw new Error("Invalid token format");
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        alert("Session expired. Please login again.");
        router.push("/seller-login");
      }
    } else {
      alert("Please login to view orders");
      router.push("/seller-login");
    }
  }, [router]);

  useEffect(() => {
    if (!tk) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(user_order_list_url, {
          headers: {
            Authorization: `Bearer ${tk}`,
          },
        });

        if (response.data?.status === "SUCCESS") {
          setOrders(response.data.data.orders || []);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          router.push("/seller-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tk, router]);

  const fetchOrderDetails = async (orderId) => {
    if (!tk) return;
    
    setDetailsLoading(true);
    try {
      const response = await axios.get(order_detail_url(orderId), {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      });

      if (response.data?.status === "SUCCESS") {
        // Handle the nested orderRs object
        setOrderDetails(response.data.data.orderRs || response.data.data);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again later.");
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        router.push("/seller-login");
      }
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.docId);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy hh:mm a");
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      INITIAL: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      PROCESSING: { bg: "bg-blue-100", text: "text-blue-800", label: "Processing" },
      SHIPPED: { bg: "bg-purple-100", text: "text-purple-800", label: "Shipped" },
      DELIVERED: { bg: "bg-green-100", text: "text-green-800", label: "Delivered" },
      CANCELLED: { bg: "bg-red-100", text: "text-red-800", label: "Cancelled" },
    };

    const statusInfo = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.label}
      </span>
    );
  };

  const handleDownloadInvoice = async (orderId) => {
    if (!orderId) {
      toast.error('No order ID provided');
      return;
    }

    try {
      const response = await axios.get(invoice_download_url(orderId), {
        headers: {
          'Authorization': `Bearer ${tk}`,
          'Content-Type': 'application/json',
        },
        responseType: '',
      });

      // Create  link to download
      const url = window.URL.createObjectURL(new ([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="p-4 text-gray-500">No orders found.</div>;
  }

  return (
    <TabsContent value="orders" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex items-center gap-2">
          {/* Removed Export Button */}
        </div>
      </div>

      {/* Order Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Order Details</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
          {detailsLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : orderDetails ? (
            <div className="grid gap-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm">{orderDetails.docId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p>{orderDetails.orderTime ? format(new Date(orderDetails.orderTime), "MMM dd, yyyy hh:mm a") : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">
                    {orderDetails.orderStatus || 'N/A'}
                  </Badge>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="font-medium">{orderDetails.user?.userName || 'N/A'}</p>
                    <p className="text-sm">{orderDetails.user?.email || 'N/A'}</p>
                    <p className="text-sm">{orderDetails.user?.phoneNo || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Payment Method:</span>
                      <span className="capitalize">{orderDetails.paymentMethod?.toLowerCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Total Amount:</span>
                      <span className="font-medium">₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</span>
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
                      {orderDetails.orderedItems?.map((item, index) => (
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
                                  <ReadMore text={item.description} maxLength={50} />
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>₹{item.price?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>1</TableCell>
                          <TableCell className="text-right">
                            ₹{item.price?.toFixed(2) || '0.00'}
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
                  <span>₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>₹{orderDetails.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={() => handleDownloadInvoice(orderDetails.docId)}
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
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
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => handleDownloadInvoice(orderDetails.docId)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </Dialog>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.docId}>
                <TableCell className="font-medium">
                  #{order.docId}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.user?.userName || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                </TableCell>
                <TableCell>{formatDate(order.orderTime)}</TableCell>
                <TableCell>
                  {order.orderedItems?.length > 0 ? (
                    <div>
                      <div className="font-medium">{order.orderedItems[0].pname}</div>
                      {order.orderedItems.length > 1 && (
                        <div className="text-sm text-gray-500">+{order.orderedItems.length - 1} more items</div>
                      )}
                    </div>
                  ) : 'No items'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.orderStatus)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₹{order.totalAmount?.toLocaleString('en-IN')}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(order)}
                    disabled={detailsLoading}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}