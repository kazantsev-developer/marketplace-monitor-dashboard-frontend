import axios from "axios";
import type {
  DashboardStats,
  DailyChartPoint,
  MoyskladAggregate,
  MoyskladStock,
  MoyskladStore,
  OzonOrder,
  OzonRemain,
  PaginatedResponse,
  SyncLog,
  WbCard,
  WbRemain,
  WbOrder,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const wbApi = {
  getOrders: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<WbOrder>>("/wb/orders", { params }),

  getOrdersStats: () => apiClient.get("/wb/orders/stats"),

  getRemains: (params?: Record<string, unknown>) =>
    apiClient.get<WbRemain[]>("/wb/remains", { params }),

  getCards: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<WbCard>>("/wb/cards", { params }),
};

export const ozonApi = {
  getOrders: (params?: Record<string, unknown>) =>
    apiClient.get<PaginatedResponse<OzonOrder>>("/ozon/orders", { params }),

  getRemains: (params?: Record<string, unknown>) =>
    apiClient.get<OzonRemain[]>("/ozon/remains", { params }),
};

export const moyskladApi = {
  getStocks: (params?: Record<string, unknown>) =>
    apiClient.get<MoyskladStock[]>("/moysklad/stocks", { params }),

  getAggregates: () =>
    apiClient.get<MoyskladAggregate[]>("/moysklad/aggregates"),

  getStores: () => apiClient.get<MoyskladStore[]>("/moysklad/stores"),
};

export const systemApi = {
  getSyncLogs: (params?: Record<string, unknown>) =>
    apiClient.get<SyncLog[]>("/sync/logs", { params }),

  getDashboardStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),

  getDailyChart: (days?: number) =>
    apiClient.get<DailyChartPoint[]>("/charts/orders-daily", {
      params: { days },
    }),
};

export default apiClient;
