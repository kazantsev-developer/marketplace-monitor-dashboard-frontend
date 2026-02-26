import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const wbApi = {
  getOrders: (params) => apiClient.get('/wb/orders', { params }),
  getOrdersStats: () => apiClient.get('/wb/orders/stats'),
  getRemains: (params) => apiClient.get('/wb/remains', { params }),
  getCards: (params) => apiClient.get('/wb/cards', { params }),
};

export const ozonApi = {
  getOrders: (params) => apiClient.get('/ozon/orders', { params }),
  getRemains: (params) => apiClient.get('/ozon/remains', { params }),
};

export const moyskladApi = {
  getStocks: (params) => apiClient.get('/moysklad/stocks', { params }),
  getAggregates: () => apiClient.get('/moysklad/aggregates'),
  getStores: () => apiClient.get('/moysklad/stores'),
};

export const systemApi = {
  getSyncLogs: (params) => apiClient.get('/sync/logs', { params }),
  getDashboardStats: () => apiClient.get('/dashboard/stats'),
};

export default apiClient;
