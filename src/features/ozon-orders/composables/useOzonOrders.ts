import { ref, computed } from "vue";
import { ozonApi } from "@/shared/api";
import type { OzonOrder } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber, formatMoney } from "@/shared/lib/formatters";

export function useOzonOrders() {
  const orders = ref<OzonOrder[]>([]);
  const schemeFilter = ref<string>("");
  const statusFilter = ref<string>("");
  const dateFrom = ref<string>("");
  const dateTo = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 20;

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  dateFrom.value = thirtyDaysAgo;
  dateTo.value = today;

  const schemeOptions: SelectOption[] = [
    { value: "", label: "Все схемы" },
    { value: "FBO", label: "FBO" },
    { value: "FBS", label: "FBS" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "", label: "Все статусы" },
    { value: "delivered", label: "Доставлено" },
    { value: "cancelled", label: "Отменено" },
    { value: "awaiting_packaging", label: "Ожидает упаковки" },
  ];

  const filteredOrders = computed<OzonOrder[]>(() =>
    orders.value.filter((order) => {
      if (schemeFilter.value && order.scheme !== schemeFilter.value)
        return false;
      if (statusFilter.value && order.status !== statusFilter.value)
        return false;
      if (dateFrom.value && order.createdAt && order.createdAt < dateFrom.value)
        return false;
      if (dateTo.value && order.createdAt && order.createdAt > dateTo.value)
        return false;
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredOrders.value;
    const total = filtered.length;
    const totalSum = filtered.reduce(
      (sum, o) =>
        sum +
        (o.financialData?.products?.reduce((s, p) => s + (p.price || 0), 0) ||
          0),
      0,
    );
    const fbo = filtered.filter((o) => o.scheme === "FBO").length;
    const fbs = filtered.filter((o) => o.scheme === "FBS").length;
    return [
      { label: "Всего заказов", value: formatNumber(total) },
      { label: "На сумму", value: formatMoney(totalSum) },
      { label: "FBO", value: formatNumber(fbo) },
      { label: "FBS", value: formatNumber(fbs) },
    ];
  });

  const totalPages = computed(() =>
    Math.ceil(filteredOrders.value.length / pageSize),
  );
  const paginatedOrders = computed(() =>
    filteredOrders.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize,
    ),
  );

  const statusSeverity = (s: string): string => {
    if (s === "delivered") return "success";
    if (s === "cancelled") return "danger";
    if (s === "awaiting_packaging") return "warning";
    return "info";
  };

  async function fetchOrders(): Promise<void> {
    const res = await ozonApi.getOrders({ limit: 1000 });
    orders.value = res.data.data;
  }

  /** Calculate total price for an order from financialData */
  const getOrderTotal = (order: OzonOrder): number =>
    order.financialData?.products?.reduce((s, p) => s + (p.price || 0), 0) || 0;

  return {
    orders,
    schemeFilter,
    statusFilter,
    dateFrom,
    dateTo,
    currentPage,
    pageSize,
    today,
    schemeOptions,
    statusOptions,
    filteredOrders,
    statsData,
    totalPages,
    paginatedOrders,
    statusSeverity,
    fetchOrders,
    getOrderTotal,
  };
}
