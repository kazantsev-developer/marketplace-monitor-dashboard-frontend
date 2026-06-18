import { ref, computed } from "vue";
import { wbApi } from "@/shared/api";
import type { WbCard } from "@/shared/types";
import { formatNumber } from "@/shared/lib/formatters";

export function useWbCards() {
  const cards = ref<WbCard[]>([]);
  const searchQuery = ref<string>("");
  const currentPage = ref<number>(1);
  const pageSize = 20;

  const filteredCards = computed<WbCard[]>(() => {
    if (!searchQuery.value) return cards.value;
    const q = searchQuery.value.toLowerCase();
    return cards.value.filter(
      (card) =>
        card.vendorCode?.toLowerCase().includes(q) ||
        card.title?.toLowerCase().includes(q) ||
        card.brand?.toLowerCase().includes(q) ||
        String(card.nmId).includes(q),
    );
  });

  const statsData = computed(() => {
    const filtered = filteredCards.value;
    const total = filtered.length;
    const uniqueBrands = new Set(filtered.map((c) => c.brand).filter(Boolean))
      .size;
    const withPhotos = filtered.filter((c) => c.photos?.length).length;
    const updatedLastHour = filtered.filter(
      (c) =>
        c.updatedAt &&
        new Date().getTime() - new Date(c.updatedAt).getTime() < 3600000,
    ).length;
    return [
      { label: "Всего карточек", value: formatNumber(total) },
      { label: "Уникальных брендов", value: formatNumber(uniqueBrands) },
      { label: "С фото", value: formatNumber(withPhotos) },
      { label: "Обновлено за час", value: formatNumber(updatedLastHour) },
    ];
  });

  const totalPages = computed(() =>
    Math.ceil(filteredCards.value.length / pageSize),
  );
  const paginatedCards = computed(() =>
    filteredCards.value.slice(
      (currentPage.value - 1) * pageSize,
      currentPage.value * pageSize,
    ),
  );

  async function fetchCards(): Promise<void> {
    const res = await wbApi.getCards({ limit: 1000 });
    cards.value = res.data.data;
  }

  return {
    cards,
    searchQuery,
    currentPage,
    pageSize,
    filteredCards,
    statsData,
    totalPages,
    paginatedCards,
    fetchCards,
  };
}
