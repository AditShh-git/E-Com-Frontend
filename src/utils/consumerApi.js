// src/utils/consumerApi.js
"use client";

import axios from "axios";
import { useUserStore } from "@/store/user-store";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
});

//  Always attach User Token
API.interceptors.request.use(
  (config) => {
    try {
      const token = useUserStore.getState().token;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("USER TOKEN READ FAILED", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
