import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div className="text-xl">Verifying...</div>}>
      <VerifyClient />
    </Suspense>
  );
}

export default VerifyPageWrapper;

// ---------------- CLIENT COMPONENT BELOW ----------------

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { verify_email_url } from "@/constants/backend-urls";
import { useUserStore } from "@/store/userStore";

function VerifyClient() {
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

    async function verify() {
      try {
        const res = await axios.get(verify_email_url, { params: { token } });

        if (res.data.status === "SUCCESS") {
          toast.success("Email verified successfully!");
          logout();

          setTimeout(() => router.push("/signin"), 1500);
        } else {
          toast.error(res.data.message || "Verification failed.");
        }
      } catch (error) {
        toast.error("Verification link expired or invalid.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen text-xl">
      {loading ? "Verifying email..." : "Redirecting..."}
    </div>
  );
}
