"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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

import { seller_login_url } from "@/constants/backend-urls";

// IMPORTANT: Correct store import
import { useSellerStore } from "@/store/seller-store";

export default function SellerSignIn() {
  const { login } = useSellerStore();  // NOW FIXED
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(seller_login_url, formData);

      if (res.data.status === "SUCCESS") {
        const data = res.data.data;

        const seller = {
          id: data.empId,
          fullName: data.fullname,
          email: data.email,
          sellerId: data.sellerId,
        };

        const token = data.accessToken;

        // Save token in correct store that dashboard can read
        login(seller, token);

        toast.success("Seller login successful");

        router.push("/seller-dashboard");
      } else {
        toast.error(res.data.message || "Invalid seller credentials");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Seller login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-xl">Seller Login</CardTitle>
          <CardDescription className="text-center">
            Access your seller dashboard
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">

            {/* Email */}
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  name="email"
                  type="email"
                  placeholder="seller@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm">
              Not a seller?{" "}
              <Link href="/seller-signup" className="text-primary underline">
                Register as Seller
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
