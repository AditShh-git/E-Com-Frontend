"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// import axios from "axios"; // ❌ Commented - no backend
import { useUserStore } from "@/store/user-store";
// import { consumer_login_url } from "@/constants/backend-urls"; // ❌ Commented - no backend

export default function UserSignIn() {
  const { login } = useUserStore();
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
      // ❌ Commented - Backend API call
      // const res = await axios.post(consumer_login_url, formData);

      // if (res.data.status === "SUCCESS") {
      //   const data = res.data.data;

      //   const user = {
      //     id: data.empId,
      //     fullName: data.fullname,
      //     email: data.email,
      //     role: "USER",
      //   };

      //   login(user, data.accessToken, "USER");
      //   toast.success("Login successful");
      //   router.push("/");
      // } else {
      //   toast.error(res.data.message || "Invalid credentials");
      // }

      // ✅ Frontend-only mock login
      const mockUser = {
        id: "user-123",
        fullName: "Rahul Kumar",
        email: formData.email,
        role: "USER",
      };

      const mockToken = "mock-user-token-123";

      // Store mock user info
      login(mockUser, mockToken, "USER");
      
      toast.success("Login successful");
      
      // ✅ Redirect to home page
      router.push("/");

    } catch (err) {
      // ❌ Commented - Backend error handling
      // toast.error(err.response?.data?.message || "Login failed");
      
      // ✅ Frontend-only error handling
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        </div>

        {/* Form */}
        <div className="space-y-6">
          
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-gray-400 focus:ring-0"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-sm focus:border-gray-400 focus:ring-0"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-left">
            <Link href="/forgot-password" className="text-sm text-pink-600 hover:text-pink-700">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full rounded-full bg-gradient-to-r from-pink-600 to-red-600 py-6 text-base font-medium text-white hover:from-pink-700 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-4 text-gray-500">Or login with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border border-gray-300 bg-white py-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border border-gray-300 bg-white py-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Google
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-pink-600 hover:text-pink-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
