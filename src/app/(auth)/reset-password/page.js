"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const runtime = "nodejs";


import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { reset_password_url } from "@/constants/backend-urls.js";

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or expired password reset link.");
      router.push("/signin");
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        reset_password_url,
        {
          token,
          newPassword: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "SUCCESS") {
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/signin"), 1500);
      } else {
        toast.error(
          res.data?.error?.errors?.[0]?.message || "Invalid token."
        );
      }
    } catch (err) {
      toast.error("Reset failed. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Reset Password
        </h2>

        <label>New Password</label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded mt-1 mb-4 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️‍🗨️" : "👁️"}
          </button>
        </div>

        <button
          className="w-full p-2 bg-green-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
