// src/services/recommend-service.js
import API from "@/utils/consumerApi";

export const getFrequentlyBoughtTogether = (productId, limit = 5) =>
  API.get(`/aimdev/api/recommend/fbt/${productId}?limit=${limit}`);

export const getPeopleAlsoBought = (productId, limit = 10) =>
  API.get(`/aimdev/api/recommend/pab/${productId}?limit=${limit}`);

export const getTrending = (days = 7, limit = 10) =>
  API.get(`/aimdev/api/recommend/trending?days=${days}&limit=${limit}`);

export const getRecommendedForUser = (limit = 10) =>
  API.get(`/aimdev/api/recommend/recommended?limit=${limit}`);

export const getTopByCategory = (category, limit = 10) =>
  API.get(`/aimdev/api/recommend/category/${encodeURIComponent(category)}?limit=${limit}`);
