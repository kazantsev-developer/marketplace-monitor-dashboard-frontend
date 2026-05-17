// Global basic types

/** Any entity with an identifier */
export interface HasId {
  id: number | string;
}

/** Any entity with creation/update timestamps */
export interface Timestamped {
  createdAt?: string;
  updatedAt?: string;
}

/** Base entity combining id and timestamps */
export interface BaseEntity extends HasId, Timestamped {}

/** Standard paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

/** Common pagination query parameters */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

// Wildberries domain
/** Basic product fields used across orders, remains and cards */
export interface WbProductBasic {
  nomenclatureId: number;
  brand?: string;
  category?: string;
  supplierArticle?: string;
}

/** Wildberries order */
export interface WbOrder extends WbProductBasic, Timestamped {
  orderNumber: string;
  techSize: string;
  totalPrice: number;
  warehouseName: string;
  destinationCity: string;
  isCanceled: boolean;
  date: string;
}

/** Wildberries stock remaining */
export interface WbRemain extends WbProductBasic {
  size: string;
  barcode: string;
  warehouse: string;
  quantity: number;
}

/** Wildberries product card */
export interface WbCard extends WbProductBasic, Timestamped {
  vendorCode: string;
  title: string;
  photos: WbPhoto[];
  sizes: WbSize[];
}

/** Product photo */
export interface WbPhoto {
  big: string;
  medium?: string;
  small?: string;
}

/** Product size with optional SKU */
export interface WbSize {
  techSize: string;
  sku?: string;
}

/** Query parameters for WB orders */
export interface WbOrdersParams extends PaginationParams {
  from?: string;
  to?: string;
  status?: "active" | "cancelled";
  search?: string;
}

/** Query parameters for WB remains */
export interface WbRemainsParams {
  warehouse?: string;
  search?: string;
}

/** Query parameters for WB cards */
export interface WbCardsParams extends PaginationParams {
  search?: string;
}

// Ozon domain
/** Basic product fields for Ozon */
export interface OzonProductBasic {
  sku: string;
  itemCode?: string;
  name: string;
  brand?: string;
}

/** Ozon order */
export interface OzonOrder extends Timestamped {
  postingNumber: string;
  status: OzonOrderStatus;
  scheme: "FBO" | "FBS";
  products: OzonOrderProduct[];
  financialData: {
    products: Array<{ price: number }>;
  };
}

export type OzonOrderStatus =
  | "delivered"
  | "cancelled"
  | "awaiting_packaging"
  | "arbitration"
  | "awaiting_delivery";

export interface OzonOrderProduct {
  price: number;
  quantity?: number;
  name?: string;
}

/** Ozon stock remaining */
export interface OzonRemain extends OzonProductBasic {
  category: string;
  fboVisibleAmount: number;
  fboPresentAmount: number;
}

/** Query parameters for Ozon orders */
export interface OzonOrdersParams extends PaginationParams {
  scheme?: "FBO" | "FBS";
  status?: OzonOrderStatus;
  from?: string;
  to?: string;
}

/** Query parameters for Ozon remains */
export interface OzonRemainsParams {
  brand?: string;
  search?: string;
}

// MoySklad domain
/** Stock item from MoySklad */
export interface MoyskladStock {
  productUuid: string;
  storeUuid: string;
  productName: string;
  article: string;
  storeName: string;
  stock: number;
  reserve: number;
  inTransit: number;
}

/** Store info */
export interface MoyskladStore {
  uuid: string;
  name: string;
}

/** Aggregated product totals */
export interface MoyskladAggregate {
  productUuid: string;
  article: string;
  name: string;
  totalStock: number;
  totalReserve: number;
  totalInTransit: number;
}

/** Query parameters for MoySklad stocks */
export interface MoyskladStocksParams {
  productUuid?: string;
  storeUuid?: string;
}

// System types
/** Sync log entry */
export interface SyncLog extends BaseEntity {
  entityType: "orders" | "remains" | "cards" | "moysklad";
  status: "success" | "error";
  recordsCount: number;
  executionTimeSeconds: number;
  errorMessage?: string;
  syncAt: string;
}

/** Dashboard aggregated statistics */
export interface DashboardStats {
  wb: {
    orders: number;
    remains: number;
    cards: number;
  };
  ozon: {
    orders: number;
    remains: number;
  };
  moysklad: {
    totalStock: number;
  };
  sync: {
    last24h: number;
    successRate: number;
  };
}

/** Daily orders chart point */
export interface DailyChartPoint {
  date: string;
  wbOrders: number;
  ozonOrders: number;
}
