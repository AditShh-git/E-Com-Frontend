"use client";

import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { delete_account_url } from "@/constants/backend-urls";
import { useUserStore } from "@/store/user-store";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/ui-components/ConfirmDialog";

export default function DeleteAccount({ token, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // <-- popup state

  const { logout } = useUserStore();
  const router = useRouter();

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(delete_account_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200 && (res.data?.status === "SUCCESS" || res.data?.message)) {
        toast.success("Account deleted successfully!");

        logout?.();
        onDeleted?.();

        router.push("/");
      } else {
        toast.error(res.data?.message || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all related data. This action cannot be undone.
        </p>
        <div className="flex justify-end">
          <Button variant="destructive" onClick={() => setOpen(true)} disabled={loading}>
            {loading ? "Deleting..." : "Delete my account"}
          </Button>
        </div>
      </div>

      {/* ========================= */}
      {/* CONFIRM DELETE POPUP */}
      {/* ========================= */}
      <ConfirmDialog
        open={open}
        title="Delete Account"
        description="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
