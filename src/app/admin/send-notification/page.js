"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { ArrowLeft, Send, Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

export default function SendNotification() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");
  const [isLoading, setIsLoading] = useState(false);
  const token = useUserStore((state) => state.token);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipientType: "consumers", // consumers, sellers, both
    link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecipientChange = (value) => {
    setFormData((prev) => ({ ...prev, recipientType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // ❌ Commented - Backend API call
      // const payload = {
      //   title: formData.title,
      //   message: formData.message,
      //   recipientType: formData.recipientType,
      //   link: formData.link || null,
      // };

      // const res = await axios.post(
      //   "http://localhost:8989/aimdev/api/admin/notifications/send",
      //   payload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // if (res.data.status === "SUCCESS") {
      //   toast.success("Notification sent successfully!");
      //   router.push("/admin/notifications");
      // } else {
      //   toast.error(res.data.message || "Failed to send notification");
      // }

      // ✅ Frontend-only mock submission
      console.log("Notification submitted:", formData);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Notification sent successfully!");
      router.push("/admin/notifications");

    } catch (err) {
      // ❌ Commented - Backend error handling
      // console.error("Send Notification Error:", err);
      // toast.error(err.response?.data?.message || "Failed to send notification");
      
      // ✅ Frontend-only error handling
      console.error("Send Notification Error:", err);
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipientIcon = (type) => {
    switch (type) {
      case "consumers":
        return <Users className="h-5 w-5" />;
      case "sellers":
        return <ShoppingBag className="h-5 w-5" />;
      case "both":
        return <Users className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getRecipientCount = (type) => {
    // Mock counts - replace with actual API data
    switch (type) {
      case "consumers":
        return "~1,234 users";
      case "sellers":
        return "~156 sellers";
      case "both":
        return "~1,390 users";
      default:
        return "";
    }
  };

  if (!token) {
    return <div className="p-10 text-xl">Loading session...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/notifications")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notifications
          </Button>
          
          <h1 className="text-2xl font-bold">Send Notification</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Send announcements and updates to users and sellers
          </p>
        </div>

        <div className="max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" />
                Create Notification
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                
                {/* Title Field */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Notification Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g., New Feature Announcement"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Write your notification message here..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.message.length} characters
                  </p>
                </div>

                {/* Recipient Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Send To <span className="text-red-500">*</span>
                  </Label>
                  
                  <RadioGroup
                    value={formData.recipientType}
                    onValueChange={handleRecipientChange}
                    className="space-y-3"
                  >
                    {/* Consumers Only */}
                    <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="consumers" id="consumers" className="mt-1" />
                      <label htmlFor="consumers" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="h-4 w-4 text-blue-600" />
                          Consumers Only
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send notification to all registered customers
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRecipientCount("consumers")}
                        </p>
                      </label>
                    </div>

                    {/* Sellers Only */}
                    <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="sellers" id="sellers" className="mt-1" />
                      <label htmlFor="sellers" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          <ShoppingBag className="h-4 w-4 text-green-600" />
                          Sellers Only
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send notification to all registered sellers
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRecipientCount("sellers")}
                        </p>
                      </label>
                    </div>

                    {/* Both */}
                    <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="both" id="both" className="mt-1" />
                      <label htmlFor="both" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="h-4 w-4 text-purple-600" />
                          All Users (Consumers & Sellers)
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Send notification to everyone on the platform
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {getRecipientCount("both")}
                        </p>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Optional Link */}
                <div className="space-y-2">
                  <Label htmlFor="link" className="text-sm font-medium">
                    Action Link (Optional)
                  </Label>
                  <Input
                    id="link"
                    name="link"
                    type="url"
                    placeholder="e.g., /products/new-arrivals"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Add a link for users to navigate when they click the notification
                  </p>
                </div>

                {/* Preview */}
                <div className="border-t pt-6">
                  <Label className="text-sm font-medium mb-3 block">
                    Preview
                  </Label>
                  <div className="border rounded-lg p-4 bg-blue-50/30">
                    <div className="flex items-start gap-3">
                      {getRecipientIcon(formData.recipientType)}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">
                          {formData.title || "Notification Title"}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.message || "Your message will appear here..."}
                        </p>
                        {formData.link && (
                          <p className="text-xs text-blue-600 mt-2">
                            🔗 {formData.link}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Notification
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/notifications")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}