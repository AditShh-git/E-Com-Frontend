"use client"

import { useState } from "react"
import AdminSidebar from "@/components/ui-components/admin-sidebar"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("settings")
  const [commission, setCommission] = useState(0)

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1">
        {/* Page Header */}
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-primary">Admin Settings</h1>
          <p className="text-muted-foreground">Manage all admin settings</p>
        </header>

        {/* Main Content */}
        <div className="flex flex-col w-full p-6 bg-red-50 dark:bg-gray-900 text-gray-800 dark:text-white">
          {/* Platform Preferences */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Platform Preferences</h2>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <h3 className="text-base font-semibold mb-2">Delivery Toggle</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm">Enable or disable delivery options for all listed products</p>
                <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                  </label>
              </div>
            </div>
          </section>

          {/* Admin Roles */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Admin Roles</h2>
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Permission</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                <tr className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-4">Emily Carter</td>
                  <td className="p-4">emily.carter@email.com</td>
                  <td className="p-4">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-xl font-medium">
                      Admin
                    </span>
                  </td>
                  <td className="p-4">Full Access</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Notification Toggles */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Notification Toggles</h2>

            {[
              { label: "New Listings", description: "Receive notifications for new products" },
              { label: "User Feedback", description: "Receive user feedback for new products" },
              { label: "New Messages", description: "Receive messages for new products" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 mb-6 p-4 rounded-xl shadow"
              >
                <h3 className="text-base font-semibold mb-2">{item.label}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
