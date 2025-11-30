"use client";

import { useEffect, useState, useCallback } from "react";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";

import ProfileForm from "@/components/account/ProfileForm";
import DeleteAccount from "@/components/account/DeleteAccount";
import EmailVerifyPopup from "@/components/account/EmailVerifyPopup";

import { useUserStore } from "@/store/user-store";
import { BASE_URL, user_me_url } from "@/constants/backend-urls";

const SELLER_ME_URL = `${BASE_URL}/aimdev/api/seller/me`;

export default function AccountPage() {
  const token = useUserStore((s) => s.token);
  const role = useUserStore((s) => s.role);
  const logout = useUserStore((s) => s.logout);

  const [activeTab, setActiveTab] = useState("profile");
  const [accountDetails, setAccountDetails] = useState(null);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  // ==================================================
  // Fetch account details
  // ==================================================
  const fetchAccountDetails = useCallback(async () => {
    if (!token) return;

    try {
      const url = role === "SELLER" ? SELLER_ME_URL : user_me_url;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload =
        res.data?.data?.user ||
        res.data?.data ||
        res.data;

      setAccountDetails(payload);

    } catch (error) {
      console.log("Account fetch failed:", error);

      if ([401, 403].includes(error?.response?.status)) {
        logout();
        toast.info("Session expired. Please sign in again.");
        window.location.href = "/signin";
      }
    }
  }, [token, role]);

  useEffect(() => {
    if (token) fetchAccountDetails();
  }, [token]);

  const onProfileUpdated = () => fetchAccountDetails();

  // ==================================================
  // Build Profile Image URL (fixed)
  // ==================================================
  let profileImg = "/placeholder.svg";

  if (accountDetails?.imageUrl) {
    let path = accountDetails.imageUrl;
    if (!path.startsWith("/aimdev")) {
      path = "/aimdev" + path;
    }
    profileImg = `${BASE_URL}${path}?token=${token}`;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">

        {/* SIDEBAR */}
        <div className="md:w-64 flex-shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileImg} alt="Profile" className="object-cover" />
              <AvatarFallback>
                {accountDetails?.fullName?.slice(0, 2)?.toUpperCase() || "AC"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-bold text-lg">
                {accountDetails?.fullName || "My Account"}
              </h2>
              <p className="text-sm text-gray-500">
                {accountDetails?.email || ""}
              </p>
            </div>
          </div>

          {/* SIDEBAR MENU */}
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "profile" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "orders" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package className="h-5 w-5 mr-3" />
              Orders
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "addresses" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <MapPin className="h-5 w-5 mr-3" />
              Addresses
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "payment" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("payment")}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payment Methods
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "notifications" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start ${activeTab === "settings" ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>

            <Separator className="my-4" />

            {/* LOGOUT */}
            <Button
              onClick={() => {
                logout();
                toast.success("Logged out successfully.");
              }}
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </nav>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile" className="space-y-6">
              <h2 className="text-2xl font-bold">My Profile</h2>

              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your details</CardDescription>
                </CardHeader>

                <CardContent>
                  <ProfileForm
                    accountDetails={accountDetails}
                    token={token}
                    role={role}
                    onUpdated={onProfileUpdated}
                    onEmailVerificationRequired={() => setShowVerifyPopup(true)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>Permanently delete your account</CardDescription>
                </CardHeader>

                <CardContent>
                  <DeleteAccount token={token} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* EMAIL VERIFICATION POPUP */}
      <EmailVerifyPopup
        open={showVerifyPopup}
        onClose={() => setShowVerifyPopup(false)}
      />
    </div>
  );
}
