"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { user_order_list_url } from "@/constants/backend-urls";
import Image from "next/image";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tk, setTk] = useState(null);

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
        setError("Session expired. Please login again.");
      }
    } else {
      setError("Please login to view customers");
    }
  }, []);

  useEffect(() => {
    if (!tk) return;

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(user_order_list_url, {
          headers: {
            Authorization: `Bearer ${tk}`,
          },
        });

        if (response.data?.status === "SUCCESS") {
          // Extract unique customers from orders
          const customerMap = new Map();
          response.data.data.orders?.forEach(order => {
            if (order.user) {
              customerMap.set(order.user.docId, {
                id: order.user.docId,
                name: order.user.userName,
                email: order.user.email,
                phone: order.user.phoneNo,
                image: order.user.imageId,
                orderCount: (customerMap.get(order.user.docId)?.orderCount || 0) + 1,
                lastOrder: order.orderTime
              });
            }
          });
          
          setCustomers(Array.from(customerMap.values()));
        } else {
          throw new Error("Failed to fetch customers");
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err.response?.data?.message || 'Failed to load customers. Please try again later.');
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [tk]);

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TabsContent value="customers" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Customers ({customers.length})</h2>
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <TableRow key={customer.id || index}>
                  <TableCell className="font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {customer?.image ? (
                          <Image 
                            src={customer.image} 
                            alt={customer.name || 'Customer'}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-sm">
                            {customer?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{customer.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{customer.email || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">{customer.phone || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {customer.orderCount || 0} orders
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Orders
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No matching customers found' : 'No customers available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </TabsContent>
  );
}