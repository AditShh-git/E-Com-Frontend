"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { update_profile_url, BASE_URL } from "@/constants/backend-urls";

export default function ProfileForm({
  accountDetails,
  token,
  role = "USER",
  onUpdated,
  onEmailVerificationRequired,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // ------------------------------------------------------------
  // LOAD USER + GENERATE PRIVATE IMAGE URL WITH TOKEN
  // ------------------------------------------------------------
  useEffect(() => {
    console.log("PROFILE TOKEN:", token);
    if (!accountDetails) return;

    setForm({
      fullName: accountDetails.fullName || "",
      email: accountDetails.email || "",
      phone: accountDetails.phoneNo || "",
    });

    if (accountDetails.imageUrl) {
      let path = accountDetails.imageUrl;

      if (!path.startsWith("/aimdev")) {
        path = "/aimdev" + path;
      }

      const finalUrl = `${BASE_URL}${path}?token=${token}`;
      setImagePreview(finalUrl);
      setRemoveImage(false);
    }
  }, [accountDetails, token]);

  // ------------------------------------------------------------
  // INPUT HANDLER
  // ------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ------------------------------------------------------------
  // SELECT NEW IMAGE
  // ------------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRemoveImage(false);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ------------------------------------------------------------
  // SAVE PROFILE
  // ------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const fd = new FormData();
      fd.append("fullName", form.fullName);
      fd.append("email", form.email);
      fd.append("phoneNo", form.phone);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      // Important: remove flag
      fd.append("removeImage", removeImage ? "true" : "false");

      const url =
        role === "SELLER"
          ? `${BASE_URL}/aimdev/api/seller/profile/update`
          : update_profile_url;

      const res = await axios.put(url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const msg =
        res.data?.data?.message ||
        res.data?.message ||
        res.data?.description ||
        "";

      if (msg.toLowerCase().includes("verification email")) {
        toast.success("Verification email sent!");
        onEmailVerificationRequired?.();
        return;
      }

      if (res.data?.status === "SUCCESS") {
        toast.success("Profile updated successfully!");
        onUpdated?.();
      } else {
        toast.error(msg || "Update failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setIsSaving(false);
    }
  };

  // ------------------------------------------------------------
  // UPDATE PASSWORD
  // ------------------------------------------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      setPwdLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("oldPassword", oldPassword);
      fd.append("newPassword", newPassword);
      fd.append("confirmPassword", confirmPassword);

      const url =
        role === "SELLER"
          ? `${BASE_URL}/aimdev/api/seller/profile/update`
          : update_profile_url;

      const res = await axios.put(url, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status === "SUCCESS") {
        toast.success("Password updated!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data?.message || "Failed to update password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setPwdLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* PROFILE FORM */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <Label>Full Name</Label>
            <Input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="mt-2"
            />
          </div>

          {/* PROFILE IMAGE */}
          <div>
            <Label>Profile Image</Label>

            {imagePreview ? (
              <div className="mt-2 space-y-2">
                <img
                  src={imagePreview}
                  className="h-28 w-28 rounded-full object-cover border"
                />

                <div className="flex gap-3">
                  {/* CHANGE IMAGE */}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      document.getElementById("imageUploadInput").click()
                    }
                  >
                    Change Image
                  </Button>

                  {/* DELETE IMAGE */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setRemoveImage(true);
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    Delete Image
                  </Button>
                </div>

                {/* HIDDEN FILE INPUT */}
                <input
                  id="imageUploadInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>

      <hr />

      {/* PASSWORD CHANGE */}
      <form onSubmit={handleChangePassword} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {role === "USER" && (
            <div>
              <Label>Old Password</Label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={pwdLoading}>
            {pwdLoading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
