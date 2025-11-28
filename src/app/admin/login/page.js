"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { consumer_login_url } from "@/constants/backend-urls"
import axios from "axios"
import { useUserStore } from "@/store/user-store";


export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const login = useUserStore((state) => state.login);
const handleSubmit = async (e) => {
   
    
   e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(consumer_login_url, {
        username: formData.email,
        password: formData.password,
      });

      console.log("API Response:", res.data);

      if (res.data.status?.toUpperCase() === "SUCCESS") {
        login(res.data.data, res.data.data.accessToken, "consumer"); 
        toast.success("Login successful!", {
          description: "Welcome to the admin dashboard.",
        });
        router.push("/admin/dashboard");
      } else if (res.data?.error?.errors?.[0]?.message) {
        toast.error(res.data.error.errors[0].message);
      } else {
        toast.error("Please check your information and try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error(`ERROR: An unexpected error occurred. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
      <Card className="w-full max-w-md border-red-100">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials to access the dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@marketplace.com"
                  className="pl-10 border-primary/30 focus-visible:ring-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 border-primary/30 focus-visible:ring-primary"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-red-50 p-3 rounded-md border border-red-100">
              <strong>Demo Credentials:</strong>
              <br />
              Email: admin@marketplace.com
              <br />
              Password: admin123
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In to Admin Panel"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
