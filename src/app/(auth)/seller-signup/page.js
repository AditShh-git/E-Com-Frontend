"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Building2,
  CreditCard,
  FileText,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { seller_signup_url, file_upload_url, file_img_url } from "@/constants/backend-urls";

export default function SignUp() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
    gst: "",
    adhaar: "",
    panCard: "",
    image: null,
  });

  /* ----------------------------------------------------
     HANDLE INPUT CHANGES
  -----------------------------------------------------*/
  const handleTextChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNo") {
      const digits = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phoneNo: digits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------------------------------------
     IMAGE UPLOAD + PREVIEW
  -----------------------------------------------------*/
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  /* ----------------------------------------------------
     FINAL SELLER SIGNUP SUBMISSION
     Backend expects: multipart/form-data
  -----------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Frontend validation before hitting backend
    if (formData.phoneNo.length !== 10) {
      toast.error("Phone number must be 10 digits and start with 6/7/8/9.");
      setIsLoading(false);
      return;
    }

    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("phoneNo", formData.phoneNo);
    fd.append("password", formData.password);
    fd.append("gst", formData.gst);
    fd.append("adhaar", formData.adhaar);
    fd.append("panCard", formData.panCard);

    if (formData.image) {
      fd.append("image", formData.image);
    }

    try {
      const res = await axios.post(seller_signup_url, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Signup response →", res.data);

      if (res.data.status === "SUCCESS") {
        toast.success("Seller account created successfully.");
        router.push("/seller-login");
        return;
      }

      // Backend returned failure
      toast.error(
        res.data?.error?.message ||
          res.data?.message ||
          "Signup failed. Please check your details."
      );

    } catch (err) {
      console.error("Signup error:", err);

      const backendMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Unexpected server error.";

      toast.error(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------------------------------------------
     UI
  -----------------------------------------------------*/
  return (
    <div className="flex min-h-[86vh] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1 border-b pb-7 mb-7">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Register as a Seller
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Enter your information to become a Seller
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* ---------------- Personal Info ---------------- */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-primary">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="fullName"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="phoneNo"
                      placeholder="9876543210"
                      className="pl-10"
                      maxLength={10}
                      value={formData.phoneNo}
                      onChange={handleTextChange}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleTextChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- Business Docs ---------------- */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-primary">
                Business Documents
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* GST */}
                <div>
                  <Label>GST Number</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="gst"
                      placeholder="GST Number"
                      className="pl-10"
                      value={formData.gst}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>

                {/* Aadhaar */}
                <div>
                  <Label>Aadhaar Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="adhaar"
                      placeholder="Aadhaar Number"
                      className="pl-10"
                      value={formData.adhaar}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>

                {/* PAN */}
                <div>
                  <Label>PAN Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      name="panCard"
                      placeholder="ABCDE1234F"
                      className="pl-10"
                      value={formData.panCard}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <Label>Profile Image</Label>
                  <div className="relative">
                    <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="file"
                      accept="image/*"
                      className="pl-10"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-28 w-28 rounded-md object-cover border mt-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6 border-t">
            <Button
              type="submit"
              className="w-full max-w-md mx-auto py-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Seller Account"}
            </Button>

            <div className="text-center text-sm">
              Already a seller?{" "}
              <Link
                href="/seller-login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
