// src/utils/consumerApi.js
// Axios instance for consumer (user) APIs
// Uses storage key: "consumer-auth"

import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  withCredentials: false,
});

function readTokenFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.state?.token || parsed?.state?.user?.accessToken || parsed?.accessToken || null;
  } catch {
    return null;
  }
}

API.interceptors.request.use(
  (config) => {
    // Prefer consumer token
    const consumerRawToken = readTokenFromStorage("consumer-auth");
    if (consumerRawToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${consumerRawToken}`;
      return config;
    }

    // Backwards compatibility: if consumer-auth isn't present, try old user-storage
    const fallback = readTokenFromStorage("user-storage");
    if (fallback) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${fallback}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
