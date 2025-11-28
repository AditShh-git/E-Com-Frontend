import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // http://localhost:8989/
});

API.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("user-storage");

    if (raw) {
      const parsed = JSON.parse(raw);
      const token =
        parsed?.state?.token ||
        parsed?.state?.user?.accessToken ||
        parsed?.accessToken ||
        null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
