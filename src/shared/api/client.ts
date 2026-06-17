import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import type {
  PaginatedResponse,
  OzonOrder,
  OzonRemain,
  WbOrder,
  WbRemain,
  WbCard,
  MoyskladStock,
  MoyskladStore,
  MoyskladAggregate,
  SyncLog,
  DashboardStats,
  DailyChartPoint,
} from "@/shared/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Outgoing requests – convert camelCase to snake_case for Go backend
apiClient.interceptors.request.use((config) => {
  if (
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData)
  ) {
    config.data = snakecaseKeys(config.data as Record<string, unknown>, {
      deep: true,
    });
  }
  return config;
});

// Incoming responses – convert snake_case to camelCase for frontend types
apiClient.interceptors.response.use((response) => {
  if (response.data && typeof response.data === "object") {
    response.data = camelcaseKeys(response.data as Record<string, unknown>, {
      deep: true,
    });
  }
  return response;
});

// Query parameters type – primitive values only, no any
type QueryParams = Record<string, string | number | undefined>;

/** Ozon API endpoints */
export const ozonApi = {
  getOrders: (params?: QueryParams) =>
    apiClient.get<PaginatedResponse<OzonOrder>>("/ozon/orders", { params }),
  getRemains: (params?: QueryParams) =>
    apiClient.get<OzonRemain[]>("/ozon/remains", { params }),
};

/** Wildberries API endpoints */
export const wbApi = {
  getOrders: (params?: QueryParams) =>
    apiClient.get<PaginatedResponse<WbOrder>>("/wb/orders", { params }),
  getOrdersStats: () => apiClient.get("/wb/orders/stats"),
  getRemains: (params?: QueryParams) =>
    apiClient.get<WbRemain[]>("/wb/remains", { params }),
  getCards: (params?: QueryParams) =>
    apiClient.get<PaginatedResponse<WbCard>>("/wb/cards", { params }),
};

/** MoySklad API endpoints */
export const moyskladApi = {
  getStocks: (params?: QueryParams) =>
    apiClient.get<MoyskladStock[]>("/moysklad/stocks", { params }),
  getAggregates: () =>
    apiClient.get<MoyskladAggregate[]>("/moysklad/aggregates"),
  getStores: () => apiClient.get<MoyskladStore[]>("/moysklad/stores"),
};

/** System API endpoints */
export const systemApi = {
  getSyncLogs: (params?: QueryParams) =>
    apiClient.get<SyncLog[]>("/sync/logs", { params }),
  getDashboardStats: () => apiClient.get<DashboardStats>("/dashboard/stats"),
  getDailyChart: (days?: number) =>
    apiClient.get<DailyChartPoint[]>("/charts/orders-daily", {
      params: { days },
    }),
};

export default apiClient;
