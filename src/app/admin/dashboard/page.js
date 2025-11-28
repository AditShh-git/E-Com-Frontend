"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, ShoppingBag, DollarSign, UserCheck, AlertTriangle, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AdminSidebar from "@/components/ui-components/admin-sidebar"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your marketplace platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=100&width=100" alt="Admin" fill className="object-cover" />
              </div>
              <span className="font-medium">Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,543</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500 font-medium">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,432</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500 font-medium">+8.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$245,678</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500 font-medium">+15.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500 font-medium">+5.7%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Registrations</CardTitle>
                    <CardDescription>New users who joined in the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={user.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  user.type === "Seller" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                }`}
                              >
                                {user.type}
                              </span>
                            </TableCell>
                            <TableCell>{user.date}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  user.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : user.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {user.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pending Seller Verifications</CardTitle>
                    <CardDescription>Sellers waiting for document verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingSellers.map((seller) => (
                        <div key={seller.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={seller.avatar || "/placeholder.svg"}
                                alt={seller.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{seller.name}</p>
                              <p className="text-xs text-muted-foreground">{seller.businessName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary text-primary bg-transparent"
                              asChild
                            >
                              <Link href={`/admin/sellers/${seller.id}`}>Review</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin/sellers">View All Pending</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Manage user accounts, roles, and permissions</p>
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-primary" />
                      Seller Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review and verify seller documents and applications
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link href="/admin/sellers">Review Sellers</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      Order Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Monitor and manage all platform orders</p>
                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                      <Link href="/admin/orders">View Orders</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

// Sample data
const recentUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    type: "Buyer",
    date: "Dec 15, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@business.com",
    type: "Seller",
    date: "Dec 14, 2023",
    status: "Pending",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    type: "Buyer",
    date: "Dec 13, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@shop.com",
    type: "Seller",
    date: "Dec 12, 2023",
    status: "Suspended",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

const pendingSellers = [
  {
    id: 1,
    name: "Tech Solutions Inc.",
    businessName: "Electronics Store",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Fashion Hub",
    businessName: "Clothing Retailer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Home Decor Plus",
    businessName: "Furniture & Decor",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]
