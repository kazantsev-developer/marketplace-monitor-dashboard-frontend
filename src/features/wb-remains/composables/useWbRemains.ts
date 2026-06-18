import { ref, computed } from "vue";
import { wbApi } from "@/shared/api";
import type { WbRemain } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber } from "@/shared/lib/formatters";

export function useWbRemains() {
  const remains = ref<WbRemain[]>([]);
  const selectedWarehouse = ref<string>("");
  const searchQuery = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 30;

  const warehouses = computed<string[]>(() => {
    const unique = new Set(remains.value.map((r) => r.warehouse));
    return Array.from(unique).sort();
  });

  const warehouseOptions = computed<SelectOption[]>(() => [
    { value: "", label: "Все склады" },
    ...warehouses.value.map((w) => ({ value: w, label: w })),
  ]);

  const filteredRemains = computed<WbRemain[]>(() =>
    remains.value.filter((item) => {
      if (selectedWarehouse.value && item.warehouse !== selectedWarehouse.value)
        return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return (
          String(item.nmId).includes(q) ||
          (item.barcode && item.barcode.toLowerCase().includes(q))
        );
      }
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredRemains.value;
    const totalItems = filtered.length;
    const totalQuantity = filtered.reduce((s, r) => s + (r.quantity || 0), 0);
    const uniqueProducts = new Set(filtered.map((r) => r.nmId)).size;
    return [
      { label: "Всего позиций", value: formatNumber(totalItems) },
      { label: "Всего товаров", value: formatNumber(totalQuantity) },
      { label: "Уникальных товаров", value: formatNumber(uniqueProducts) },
      { label: "Складов", value: warehouses.value.length },
    ];
  });

  const totalPages = computed(() =>
    Math.ceil(filteredRemains.value.length / pageSize),
  );
  const paginatedRemains = computed(() =>
    filteredRemains.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize,
    ),
  );

  async function fetchRemains(): Promise<void> {
    const res = await wbApi.getRemains();
    remains.value = res.data;
  }

  return {
    remains,
    selectedWarehouse,
    searchQuery,
    currentPage,
    pageSize,
    warehouseOptions,
    statsData,
    totalPages,
    paginatedRemains,
    fetchRemains,
  };
}
