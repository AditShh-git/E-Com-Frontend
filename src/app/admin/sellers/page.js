"use client";

import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Download,
} from "lucide-react";
import SellerImage from "@/components/ui-components/seller-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { getallseller, seller_signup_url, file_img_url } from "@/constants/backend-urls";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSellers() {
  const [activeTab, setActiveTab] = useState("sellers");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [tk, setTk] = useState(null);

 


  useEffect(() => {
    const token = localStorage.getItem("user-storage");
    if (token) {
      const parsedToken = JSON.parse(token);
      setTk(parsedToken.state.user.accessToken);
    } else {
      alert("Please Login");
      router.push("/admin/login");
    }
  }, []);

  useEffect(() => {
    if (!tk) return;

    axios
      .get(getallseller, {
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const sellerdata = res.data.data.sellers;
        setSellers(sellerdata);
      })
      .catch((err) => {
        console.error("Error fetching Seller Details:", err);
      });
  }, [tk]);


  const handleVerificationAction = async (sellerId,seller, action) => {
    try {
      alert(action);
      if(action=="approve"){
        seller.varified= true;
      }
      if(action=="reject"){
        seller.varified= false;
      }
      const res = await axios.post(
        seller_signup_url,
        seller,
        {
          headers: {
            Authorization: `Bearer ${tk}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res) {
        setSellers((prev) =>
          prev.map((seller) =>
            seller.docId === sellerId
              ? { ...seller, verificationStatus: action === "approve" ? "Verified" : "Rejected" }
              : seller
          )
        );

        toast.success("Seller updated", {
          description: `Seller has been ${action}d successfully.`,
        });
      } else {
        toast.error("Error", {
          description: "Failed to update seller status.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Error", {
        description: "Something went wrong while verifying seller.",
      });
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.userName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      seller.verificationStatus?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">Seller Verification</h1>
          <p className="text-muted-foreground">
            Review and verify seller applications and documents
          </p>
        </header>

        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Seller Applications</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sellers..."
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
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("verified")}>
                        Verified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                        Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                  
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller.docId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden">
                            <SellerImage
                              imageId={seller.imageId}
                              alt={seller.userName}
                              className="w-full h-full rounded-full"
                              width={40}
                              height={40}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{seller.userName}</p>
                          <p className="text-xs text-muted-foreground">{seller.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            seller.varified === true || seller.varified === "true"
                              ? "default"
                              : "destructive"
                          }
                          className={
                            seller.varified === true || seller.varified === "true"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {seller.varified == true || seller.varified == "true"
                          
                          
                            ? "Verified"
                            : "Not Verified"} 
                           
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedSeller(seller)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Seller Verification Details</DialogTitle>
                                <DialogDescription>
                                  Review seller information and documents for verification
                                </DialogDescription>
                              </DialogHeader>
                              {selectedSeller && (
                                <SellerDetailsModal
                                  seller={selectedSeller}
                                  onVerify={handleVerificationAction}
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {seller.verificationStatus === "Pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleVerificationAction(seller.docId, "approve")
                                    }
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleVerificationAction(seller.docId, "reject")
                                    }
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Documents
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

// ✅ Seller Details Modal
function SellerDetailsModal({ seller, onVerify }) {
  return (
    <div className="space-y-6">
      {/* Business Information */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
          <SellerImage
            imageId={seller.imageId}
            alt={seller.userName}
            className="w-full h-full rounded-full"
            width={128}
            height={128}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Business Name
              </label>
              <p className="font-medium">{seller.businessName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Business Type
              </label>
              <p>{seller.businessType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Registration Number
              </label>
              <p>{seller.registrationNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">GST Number</label>
              <p>{seller.gstNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Owner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Owner Name
              </label>
              <p className="font-medium">{seller.userName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p>{seller.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p>{seller.phoneNo}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">PAN Number</label>
              <p>{seller.panNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Aadhaar Number
              </label>
              <p>{seller.aadhaarNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
  <Button
    variant="destructive"
    onClick={() => onVerify(seller.docId, seller, "reject")}
  >
    Reject Application
  </Button>

  {(seller.varified === false || seller.varified === "false") && (
    <Button
      className="bg-primary hover:bg-primary/90"
      onClick={() => onVerify(seller.docId, seller, "approve")}
    >
      Approve Seller
    </Button>
  )}
</div>

    </div>
  );
}
