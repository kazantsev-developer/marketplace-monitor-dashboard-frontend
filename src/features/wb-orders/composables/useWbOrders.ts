import { ref, computed } from "vue";
import { wbApi } from "@/shared/api";
import type { WbOrder } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber, formatMoney } from "@/shared/lib/formatters";

export function useWbOrders() {
  const orders = ref<WbOrder[]>([]);
  const dateFrom = ref<string>("");
  const dateTo = ref<string>("");
  const statusFilter = ref<string>("");
  const searchQuery = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 20;

  const today = new Date().toISOString().split("T")[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  dateFrom.value = thirtyDaysAgo;
  dateTo.value = today;

  const statusOptions: SelectOption[] = [
    { value: "", label: "Все статусы" },
    { value: "true", label: "Только отмененные" },
    { value: "false", label: "Только активные" },
  ];

  const filteredOrders = computed<WbOrder[]>(() =>
    orders.value.filter((order) => {
      if (dateFrom.value && order.date < dateFrom.value) return false;
      if (dateTo.value && order.date > dateTo.value) return false;
      if (statusFilter.value !== "") {
        const isCancel = statusFilter.value === "true";
        if (order.isCancel !== isCancel) return false;
      }
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return (
          order.supplierArticle?.toLowerCase().includes(q) ||
          order.srid?.toLowerCase().includes(q) ||
          order.brand?.toLowerCase().includes(q)
        );
      }
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredOrders.value;
    const total = filtered.length;
    const totalSum = filtered.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const cancelled = filtered.filter((o) => o.isCancel).length;
    const uniqueProducts = new Set(filtered.map((o) => o.nmId)).size;
    return [
      { label: "Всего заказов", value: formatNumber(total) },
      { label: "На сумму", value: formatMoney(totalSum) },
      { label: "Отменено", value: formatNumber(cancelled) },
      { label: "Уникальных товаров", value: formatNumber(uniqueProducts) },
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

  async function fetchOrders(): Promise<void> {
    const res = await wbApi.getOrders({ limit: 1000 });
    orders.value = res.data.data;
  }

  return {
    orders,
    dateFrom,
    dateTo,
    statusFilter,
    searchQuery,
    currentPage,
    pageSize,
    today,
    statusOptions,
    filteredOrders,
    statsData,
    totalPages,
    paginatedOrders,
    fetchOrders,
  };
}
