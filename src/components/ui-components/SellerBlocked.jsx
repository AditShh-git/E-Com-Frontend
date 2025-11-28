"use client";
import React from "react";

export default function SellerBlocked() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Admin Approval Needed
        </h2>
        <p className="text-gray-600 mb-6">
          Your seller account is still pending admin approval.  
          You cannot access this feature until an admin verifies your account.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
