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
import { useUserStore } from "@/store/user-store";

export default function SellerSignIn() {
  const { login } = useUserStore();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const tryVariant = async (variant) => {
    try {
      const res = await axios.post(seller_login_url, variant.body, {
        headers: variant.headers,
      });
      console.log(`[login] variant '${variant.desc}' response:`, res?.data ?? res);
      return res;
    } catch (err) {
      console.error(`[login] variant '${variant.desc}' error:`, err?.response ?? err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const variants = [
      {
        desc: "JSON {username, password}",
        headers: { "Content-Type": "application/json" },
        body: { username: formData.email, password: formData.password },
      },
      {
        desc: "JSON {email, password}",
        headers: { "Content-Type": "application/json" },
        body: { email: formData.email, password: formData.password },
      },
      {
        desc: "form-urlencoded username",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ username: formData.email, password: formData.password }).toString(),
      },
      {
        desc: "form-urlencoded email",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: formData.email, password: formData.password }).toString(),
      },
    ];

    let lastError = null;

    for (const v of variants) {
      try {
        console.log("[login] trying variant:", v.desc, { url: seller_login_url });
        const res = await tryVariant(v);

        // Normalize response
        const envelopeStatus = res?.data?.status ?? null;
        const innerData = res?.data?.data ?? res?.data ?? null;
        const httpOk = res?.status === 200 || res?.status === 201;

        if (envelopeStatus === "SUCCESS" || httpOk) {
          const token =
            innerData?.accessToken ||
            innerData?.token ||
            res?.data?.accessToken ||
            null;

          const storageObj = { state: { user: { accessToken: token, ...innerData } } };
          try {
            localStorage.setItem("user-storage", JSON.stringify(storageObj));
          } catch (err) {
            console.warn("[login] failed to persist token", err);
          }

          try {
            login(innerData, token, "seller");
          } catch (err) {
            console.warn("[login] store login failed", err);
          }

          toast.success("Logged in successfully.");
          router.push("/seller-dashboard");
          setIsLoading(false);
          return;
        } else {
          console.warn("[login] non-success response for variant", v.desc, res.data);
          lastError = res.data;
        }
      } catch (err) {
        lastError = err;
        // continue to next variant
      }
    }

    console.warn("[login] all variants failed:", lastError);
    const backendError =
      lastError?.response?.data?.error?.errors?.[0]?.message ||
      lastError?.response?.data?.error?.message ||
      lastError?.response?.data?.message ||
      lastError?.message ||
      "Invalid credentials or server rejected request";

    toast.error(backendError);

    // hint for developer in console if network/CORS
    if (!lastError?.response) {
      console.warn("[login] No response object — possible CORS or network issue.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[86vh] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Sign In as a Seller
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your seller account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
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
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full mt-5" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/seller-signup" className="text-primary hover:underline">
                Register as a Seller
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}