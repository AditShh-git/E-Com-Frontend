"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // ⏱ cooldown timer

  // countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async (e) => {
    e.preventDefault();

    if (timer > 0) return; // already in cooldown

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api/auth/resend-verification`,
        {},
        { params: { email } }
      );

      if (res.data.status === "SUCCESS") {
        toast.success("Verification email sent!");

        setTimer(30); // Start 60-second cooldown
      } else {
        toast.error(
          res.data.error?.errors?.[0]?.message ||
            "Failed to resend verification email"
        );
      }
    } catch (err) {
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="p-6 border rounded w-full max-w-md" onSubmit={handleResend}>
        <h2 className="text-xl font-bold mb-4 text-center">
          Resend Verification Email
        </h2>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mt-1 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button
          className="w-full"
          disabled={loading || timer > 0}
        >
          {loading
            ? "Sending..."
            : timer > 0
            ? `Retry in ${timer}s`
            : "Send Verification Email"}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-3">
          Didn’t receive the email?  
          {timer > 0 ? (
            <span className="font-medium">&nbsp;Wait {timer}s</span>
          ) : (
            <span className="font-medium">&nbsp;You can resend now.</span>
          )}
        </p>
      </form>
    </div>
  );
}
