"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { consumer_login_url } from "@/constants/backend-urls";
import { useUserStore } from "@/store/user-store";

export default function AdminLogin() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    localStorage.removeItem("user-storage"); // ❗ Clear old USER token

    try {
      const res = await axios.post(consumer_login_url, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.status !== "SUCCESS") {
        toast.error("Invalid credentials");
        return;
      }

      const data = res.data.data;

      if (data.role !== "ADMIN") {
        toast.error("Access denied! Only admins can login here.");
        return;
      }

      // Save token + user info
      login(data, data.accessToken, data.role);

      toast.success("Admin login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Shield className="text-white" />
          </div>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  name="email"
                  type="email"
                  className="pl-10"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
