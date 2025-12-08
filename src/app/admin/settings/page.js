"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "@/components/ui-components/admin-sidebar";
import { useUserStore } from "@/store/user-store";

const BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL}/aimdev/api`;

export default function Settings() {
  const token = useUserStore((s) => s.token);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings
  const loadSettings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/admin/settings/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
    } catch (err) {
      console.error("Error loading settings:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, [token]);

  // Save setting to backend
  const saveSetting = async (key, value) => {
    try {
      await axios.post(
        `${BASE}/admin/settings/save`,
        null,
        {
          params: { key, value },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Saving error:", err);
    }
  };

  // Update UI + save
  const handleChange = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    saveSetting(key, value);
  };

  if (!token) return <div className="p-10 text-xl">Validating session...</div>;
  if (loading || !settings) return <div className="p-10 text-xl">Loading settings...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeTab="settings" />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>

        {/* GENERAL */}
        <Section title="General Settings">
          {Object.entries(settings.general).map(([key, val]) => (
            <InputField
              key={key}
              label={beautify(key)}
              value={val}
              onChange={(v) => handleChange("general", key, v)}
            />
          ))}
        </Section>

        {/* FEATURES */}
        <Section title="Feature Configurations">
          {Object.entries(settings.features).map(([key, val]) => (
            <ToggleField
              key={key}
              label={beautify(key)}
              checked={val === "true"}
              onChange={(v) =>
                handleChange("features", key, v ? "true" : "false")
              }
            />
          ))}
        </Section>

        {/* PAYMENT */}
        <Section title="Payment Settings">
          {Object.entries(settings.payment).map(([key, val]) => (
            <InputField
              key={key}
              label={beautify(key)}
              value={val}
              onChange={(v) => handleChange("payment", key, v)}
            />
          ))}
        </Section>

        {/* SHIPPING */}
        <Section title="Shipping Settings">
          {Object.entries(settings.shipping).map(([key, val]) => (
            <InputField
              key={key}
              label={beautify(key)}
              value={val}
              onChange={(v) => handleChange("shipping", key, v)}
            />
          ))}
        </Section>

        {/* POLICY */}
        <Section title="Policy Management">
          {Object.entries(settings.policy).map(([key, val]) => (
            <InputField
              key={key}
              label={beautify(key)}
              value={val}
              onChange={(v) => handleChange("policy", key, v)}
            />
          ))}
        </Section>

        {/* SECURITY */}
        <Section title="Security Settings">
          {Object.entries(settings.security).map(([key, val]) => (
            <InputField
              key={key}
              label={beautify(key)}
              value={val}
              onChange={(v) => handleChange("security", key, v)}
            />
          ))}
        </Section>

        <div className="mt-6 flex justify-end">
          <button
            onClick={loadSettings}
            className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:opacity-90"
          >
            Refresh Values
          </button>
        </div>
      </main>
    </div>
  );
}

/* UI Components */

function Section({ title, children }) {
  return (
    <div className="mb-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        className="w-full p-2 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-primary"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded-lg bg-gray-50">
      <span className="font-medium">{label}</span>

      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="
          w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-primary
          relative transition-colors
          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
          after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform
          peer-checked:after:translate-x-full
        "></div>
      </label>
    </div>
  );
}

function beautify(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
