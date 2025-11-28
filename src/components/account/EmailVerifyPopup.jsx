"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function EmailVerifyPopup({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Verify Your New Email
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-4">
          <Mail className="h-12 w-12 text-primary" />

          <p className="text-gray-600">
            We have sent a verification link to your <b>new email address</b>.  
            Please open your inbox and click the verification link.
          </p>

          <Button onClick={onClose} className="w-full">
            Okay, Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
