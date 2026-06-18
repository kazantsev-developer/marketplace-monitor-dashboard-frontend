import { ref, computed } from "vue";
import { ozonApi } from "@/shared/api";
import type { OzonRemain } from "@/shared/types";
import type { SelectOption } from "@/shared/ui/select-filter/types";
import { formatNumber } from "@/shared/lib/formatters";

export function useOzonRemains() {
  const remains = ref<OzonRemain[]>([]);
  const brandFilter = ref<string>("");
  const searchQuery = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 30;

  const brands = computed<string[]>(() => {
    const unique = new Set(remains.value.map((r) => r.brand).filter(Boolean));
    return Array.from(unique).sort() as string[];
  });

  const brandOptions = computed<SelectOption[]>(() => [
    { value: "", label: "Все бренды" },
    ...brands.value.map((b) => ({ value: b, label: b })),
  ]);

  const filteredRemains = computed<OzonRemain[]>(() =>
    remains.value.filter((item) => {
      if (brandFilter.value && item.brand !== brandFilter.value) return false;
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase();
        return (
          item.itemCode?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q) ||
          String(item.sku).includes(q)
        );
      }
      return true;
    }),
  );

  const statsData = computed(() => {
    const filtered = filteredRemains.value;
    const totalSku = filtered.length;
    const totalVisible = filtered.reduce(
      (s, r) => s + (r.fboVisibleAmount || 0),
      0,
    );
    const totalPresent = filtered.reduce(
      (s, r) => s + (r.fboPresentAmount || 0),
      0,
    );
    const totalBrands = new Set(filtered.map((r) => r.brand).filter(Boolean))
      .size;
    return [
      { label: "Всего SKU", value: formatNumber(totalSku) },
      { label: "Доступно", value: formatNumber(totalVisible) },
      { label: "С резервом", value: formatNumber(totalPresent) },
      { label: "Брендов", value: formatNumber(totalBrands) },
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
    const res = await ozonApi.getRemains();
    remains.value = res.data;
  }

  return {
    remains,
    brandFilter,
    searchQuery,
    currentPage,
    pageSize,
    brandOptions,
    statsData,
    totalPages,
    paginatedRemains,
    fetchRemains,
  };
}
