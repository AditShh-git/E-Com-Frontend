"use client"

import Image from "next/image"
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Mail, Phone, Calendar, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import AdminSidebar from "@/components/ui-components/admin-sidebar"
import { alluser_url, delete_user_url } from "@/constants/backend-urls";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [tk, setTk] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (token) {
      const parsedToken = JSON.parse(token);
      setTk(parsedToken.state.user.accessToken);
    } else {
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    if (!tk) return;

    setIsLoading(true)
    axios
      .get(alluser_url, {
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const userData = res.data.data.users;
        setUsers(userData);
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsLoading(false)
      });
  }, [tk]);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const name = user.userName || '';
    const email = user.email || '';
    const phone = user.phoneNo || '';
    
    const matchesSearch = 
      name.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      phone.includes(searchTerm);
      
    const userStatus = user.status || 'Inactive';
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'active' && userStatus === 'Active') ||
      (filterType === 'inactive' && userStatus !== 'Active');
      
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'delete') {
        // Show confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (!confirmDelete) return;

        const response = await axios.delete(delete_user_url(userId), {
          headers: {
            Authorization: `Bearer ${tk}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data?.status === 'SUCCESS') {
          toast.success('User deleted successfully');
          // Refresh the users list
          const updatedUsers = users.filter(user => user.docId !== userId);
          setUsers(updatedUsers);
        } else {
          throw new Error(response.data?.message || 'Failed to delete user');
        }
      } else if (action === 'view') {
        const user = users.find(u => u.docId === userId);
        if (user) {
          setSelectedUser(user);
          setIsViewModalOpen(true);
        }
      }
    } catch (error) {
      console.error(`Error ${action} user:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} user`);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">User Management</h1>
          <p className="text-muted-foreground">Manage all platform users and their accounts</p>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="text-lg">All Users</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="w-full pl-8 sm:w-[200px] lg:w-[336px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.docId}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                {user.avatar ? (
                                  <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <User className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{user.userName}</p>
                                <p className="text-sm text-muted-foreground">ID: {user.docId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{user.phoneNo}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                user.status === 'Active' 
                                  ? 'bg-green-50 text-green-700' 
                                  : user.status === 'Suspended'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-gray-50 text-gray-700'
                              }
                            >
                              {user.status || 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleUserAction(user.docId, 'view')}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600" 
                                  onClick={() => handleUserAction(user.docId, 'delete')}
                                >
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No users found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* User Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <Button
              variant="ghost"
              className="absolute right-4 top-4 h-8 w-8 p-0"
              onClick={() => setIsViewModalOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{selectedUser.userName || 'N/A'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email || 'N/A'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    
                    <Badge variant="outline" className="capitalize">
                      {selectedUser.role || 'user'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Personal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                      <p className="text-sm">{selectedUser.userName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                      <p className="text-sm break-all">{selectedUser.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-sm">{selectedUser.phoneNo || 'N/A'}</p>
                    </div>
                    
                    
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Account Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">User ID</p>
                      <p className="text-sm font-mono text-sm">{selectedUser.docId || 'N/A'}</p>
                    </div>
                    
                      
                    
                   
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {(selectedUser.address || selectedUser.city || selectedUser.state || selectedUser.country || selectedUser.pincode) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-muted-foreground border-b pb-1">Address</h4>
                  <div className="space-y-3">
                    {selectedUser.address && (
                      <div>
                        <p className="text-sm">{selectedUser.address}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.city && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">City</p>
                          <p className="text-sm">{selectedUser.city}</p>
                        </div>
                      )}
                      {selectedUser.state && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">State</p>
                          <p className="text-sm">{selectedUser.state}</p>
                        </div>
                      )}
                      {selectedUser.country && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Country</p>
                          <p className="text-sm">{selectedUser.country}</p>
                        </div>
                      )}
                      {selectedUser.pincode && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                          <p className="text-sm">{selectedUser.pincode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-muted-foreground border-b pb-1">Additional Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.preferredLanguage && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Preferred Language</p>
                      <p className="text-sm">{selectedUser.preferredLanguage}</p>
                    </div>
                  )}
                  {selectedUser.timezone && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Timezone</p>
                      <p className="text-sm">{selectedUser.timezone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
