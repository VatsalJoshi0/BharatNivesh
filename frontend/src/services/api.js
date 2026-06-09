import axios from 'axios';
import { useAuthStore } from '../stores/authStore.js';

const configuredApiBase = import.meta.env.VITE_API_URL;
const API_BASE = configuredApiBase && !/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(configuredApiBase)
  ? configuredApiBase
  : '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API returned 401 Unauthorized. Logging out.');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Simple in-memory cache to limit API/token usage
const cache = new Map();
function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.value;
}
function setCache(key, value, ttlMs = 60 * 1000) {
  cache.set(key, { value, expiry: Date.now() + ttlMs });
}

export const authService = {
  register: async (email, password, name) => {
    const res = await apiClient.post('/auth/register', { email, password, name });
    return res.data;
  },

  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  updateProfile: async (name, risk_profile, mode) => {
    const res = await apiClient.put('/auth/profile', { name, risk_profile, mode });
    return res.data;
  },
};

export const marketService = {
  getIndices: async () => {
    const cacheKey = 'indices_v1';
    const cached = getCache(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/market/indices');
    setCache(cacheKey, res.data, 30 * 1000); // 30s TTL
    return res.data;
  },

  getQuotes: async (symbols) => {
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const cacheKey = `quotes_${symbolsParam}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/market/quotes', { params: { symbols: symbolsParam } });
    setCache(cacheKey, res.data, 60 * 1000); // 60s TTL
    return res.data;
  },

  getAnalysis: async () => {
    const res = await apiClient.get('/market/analysis');
    return res.data;
  },
};

export const onboardingService = {
  submitKyc: async (data) => {
    const res = await apiClient.post('/onboarding/kyc', data);
    return res.data;
  },

  submitQuiz: async (answers) => {
    const res = await apiClient.post('/onboarding/quiz', { answers });
    return res.data;
  },
};

export const ipoService = {
  getUpcoming: async () => {
    const res = await apiClient.get('/ipos');
    return res.data;
  },

  getIpo: async (id) => {
    const res = await apiClient.get(`/ipos/${id}`);
    return res.data;
  },
};

export const stockService = {
  getScreener: async (strategy = 'growth', filters = {}) => {
    const params = { strategy, ...filters };
    const cacheKey = `screener_${strategy}_${filters.sector || 'all'}_${filters.minPe || ''}_${filters.maxPe || ''}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    const res = await apiClient.get('/stocks/screener', { params });
    setCache(cacheKey, res.data, 300000);
    return res.data;
  },

  getStock: async (symbol) => {
    const res = await apiClient.get(`/stocks/${symbol}`);
    return res.data;
  },
};

export const portfolioService = {
  getHoldings: async () => {
    const res = await apiClient.get('/portfolio');
    return res.data;
  },
  addHolding: async (data) => {
    const res = await apiClient.post('/portfolio', data);
    return res.data;
  },
  removeHolding: async (id) => {
    const res = await apiClient.delete(`/portfolio/${id}`);
    return res.data;
  }
};

export const secondaryService = {
  getOfferings: async () => {
    const res = await apiClient.get('/secondary');
    return res.data;
  }
};

export const mutualFundService = {
  getFunds: async (params = {}) => {
    const res = await apiClient.get('/mutualfunds', { params });
    return res.data;
  },
  getSuggestions: async () => {
    const res = await apiClient.get('/mutualfunds/suggestions');
    return res.data;
  }
};

export default apiClient;
