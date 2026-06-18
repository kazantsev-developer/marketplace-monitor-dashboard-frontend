// Generic paginated response from API
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

/** Product inside an Ozon order */
export interface OzonOrderProduct {
  price: number;
  quantity: number;
}

/** Financial breakdown for an Ozon order */
export interface OzonFinancialData {
  products: OzonOrderProduct[];
}

/** Ozon order entity */
export interface OzonOrder {
  postingNumber: string;
  orderId?: number;
  orderNumber?: string;
  status?: string;
  createdAt?: string;
  products?: OzonOrderProduct[];
  financialData?: OzonFinancialData;
  scheme?: string;
  updatedAt: string;
}

/** Ozon FBO stock item */
export interface OzonRemain {
  sku: number;
  productId: number;
  itemCode?: string;
  category?: string;
  brand?: string;
  name?: string;
  fboVisibleAmount: number;
  fboPresentAmount: number;
  updatedAt: string;
  syncedAt: string;
}

/** Wildberries order entity */
export interface WbOrder {
  srid: string;
  gNumber: string;
  date: string;
  lastChangeDate: string;
  supplierArticle?: string;
  techSize?: string;
  barcode?: string;
  totalPrice: number;
  discountPercent: number;
  warehouseName?: string;
  isCancel: boolean;
  destCityName?: string;
  nmId?: number;
  category?: string;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

/** Wildberries warehouse stock */
export interface WbRemain {
  nmId: number;
  size: string;
  warehouse: string;
  quantity: number;
  barcode?: string;
  updatedAt: string;
}

/** Wildberries product card photo */
export interface WbCardPhoto {
  big: string;
}

/** Wildberries product card size variant */
export interface WbCardSize {
  sku: string;
  techSize?: string;
}

/** Wildberries product card */
export interface WbCard {
  nmId: number;
  vendorCode: string;
  brand?: string;
  title?: string;
  photos?: WbCardPhoto[];
  sizes?: WbCardSize[];
  updatedAt: string;
  createdAt: string;
  syncedAt: string;
}

/** MoySklad stock item joined with product and store names */
export interface MoyskladStock {
  productUuid: string;
  productName?: string;
  article?: string;
  storeUuid: string;
  storeName?: string;
  stock: number;
  reserve: number;
  inTransit: number;
}

/** MoySklad warehouse/store */
export interface MoyskladStore {
  uuid: string;
  name: string;
}

/** MoySklad aggregated stock totals */
export interface MoyskladAggregate {
  storeUuid: string;
  totalStock: number;
}

/** Sync job execution log */
export interface SyncLog {
  id: number;
  syncAt: string;
  status: string;
  recordsCount: number;
  dateFrom?: string;
  dateTo?: string;
  errorMessage?: string;
  pagesCount: number;
  executionTimeSeconds: number;
  entityType: string;
}

/** Dashboard summary statistics */
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

/** Aggregated daily order counts for WB and Ozon from the chart endpoint */
export interface DailyChartPoint {
  date: string;
  wbOrders: number;
  ozonOrders: number;
}
