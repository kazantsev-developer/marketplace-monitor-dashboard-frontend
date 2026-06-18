import { ref, computed } from "vue";
import { moyskladApi } from "@/shared/api";
import type { MoyskladStock, MoyskladStore } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber } from "@/shared/lib/formatters";

export function useMoySkladStocks() {
  const stocks = ref<MoyskladStock[]>([]);
  const stores = ref<MoyskladStore[]>([]);
  const selectedStore = ref<string>("");
  const searchQuery = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 30;

  const storeOptions = computed<SelectOption[]>(() => [
    { value: "", label: "Все склады" },
    ...stores.value.map((s) => ({ value: s.uuid, label: s.name })),
  ]);

  const filteredStocks = computed<MoyskladStock[]>(() =>
    stocks.value.filter((item) => {
      if (selectedStore.value && item.storeUuid !== selectedStore.value)
        return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return (
          item.productName?.toLowerCase().includes(q) ||
          item.article?.toLowerCase().includes(q)
        );
      }
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredStocks.value;
    const uniqueProducts = new Set(filtered.map((s) => s.productUuid));
    const totalStock = filtered.reduce((sum, s) => sum + (s.stock || 0), 0);
    return [
      { label: "Всего товаров", value: formatNumber(uniqueProducts.size) },
      { label: "Всего остатков", value: formatNumber(totalStock) },
      { label: "Складов", value: stores.value.length },
    ];
  });

  const totalPages = computed(() =>
    Math.ceil(filteredStocks.value.length / pageSize),
  );
  const paginatedStocks = computed(() =>
    filteredStocks.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize,
    ),
  );

  async function fetchData(): Promise<void> {
    const [stocksRes, storesRes] = await Promise.all([
      moyskladApi.getStocks(),
      moyskladApi.getStores(),
    ]);
    stocks.value = stocksRes.data;
    stores.value = storesRes.data;
  }

  return {
    stocks,
    stores,
    selectedStore,
    searchQuery,
    currentPage,
    pageSize,
    storeOptions,
    filteredStocks,
    statsData,
    totalPages,
    paginatedStocks,
    fetchData,
  };
}
