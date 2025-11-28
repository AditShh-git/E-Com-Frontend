"use client"

import React, { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { delete_account_url } from "@/constants/backend-urls"
import { useUserStore } from "@/store/user-store"
import { useRouter } from "next/navigation"

/**
 * Props:
 * - token: string
 * - onDeleted: ()=>void (optional)
 */
export default function DeleteAccount({ token, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const { logout } = useUserStore()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) return

    setLoading(true)
    try {
      const res = await axios.delete(delete_account_url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // Expecting success response
      if (res.status === 200 && (res.data?.status === "SUCCESS" || res.data?.message)) {
        toast.success("Account deleted")
        // clear local storage / logout
        logout && logout()
        onDeleted && onDeleted()
        // redirect to home or login
        router.push("/")
      } else {
        toast.error(res.data?.message || "Failed to delete account")
      }
    } catch (err) {
      console.error(err)
      const msg = err.response?.data?.message || err.message || "Server error"
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Permanently delete your account and all related data. This action cannot be undone.
      </p>
      <div className="flex justify-end">
        <Button variant="destructive" onClick={handleDelete} disabled={loading}>
          {loading ? "Deleting..." : "Delete my account"}
        </Button>
      </div>
    </div>
  )
}
