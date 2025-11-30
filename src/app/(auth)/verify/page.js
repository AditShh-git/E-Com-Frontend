"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { verify_email_url } from "@/constants/backend-urls";
import { useUserStore } from "@/store/user-store";

function VerifyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const logout = useUserStore((s) => s.logout);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      toast.error("Invalid verification link.");
      router.push("/signin");
      return;
    }

    async function verifyEmail() {
      try {
        const res = await axios.get(verify_email_url, { params: { token } });

        console.log("VERIFY RESPONSE =", res.data);

        if (res.data.status === "SUCCESS") {
          // 🔥 SAFE ROLE EXTRACTION
          const role =
            res.data.data?.role ||
            res.data.data?.data?.role ||
            res.data.role ||
            null;

          toast.success("Email verified!");
          logout();

          // 🔥 Correct redirection based on role
          if (role === "USER") router.replace("/signin");
          else if (role === "SELLER") router.replace("/seller-login");
          else if (role === "ADMIN") router.replace("/admin/login");
          else router.replace("/signin"); // fallback

        } else {
          toast.error("Verification failed.");
        }
      } catch (err) {
        toast.error("Invalid or expired link.");
      } finally {
        setLoading(false);
      }
    }

    verifyEmail();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen text-xl">
      {loading ? "Verifying email..." : "Redirecting..."}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-xl">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
