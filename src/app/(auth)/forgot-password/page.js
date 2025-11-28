"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { forgot_password_url } from "@/constants/backend-urls.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        forgot_password_url,
        {},
        { params: { email } }
      );

      if (res.data.status === "SUCCESS") {
        toast.success("Password reset link has been sent to your email.");
      } else {
        toast.error(
          res.data.error?.errors?.[0]?.message || "Something went wrong."
        );
      }
    } catch (error) {
      toast.error("Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded mt-1 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="w-full p-2 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? "Processing..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
