<template>
  <div class="container mx-auto max-w-7xl">
    <PageHeader title="Карточки товаров Wildberries" subtitle="Список всех товаров" />
    <FilterBar>
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу, названию или бренду..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-6 auto-rows-fr">
      <div v-for="card in paginatedCards" :key="card.nomenclatureId"
        class="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow h-full">
        <div class="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img v-if="card.photos?.[0]" :src="card.photos[0].big" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Нет фото</div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ card.title || 'Без названия' }}</h3>
          <div class="flex flex-wrap gap-1 mt-1">
            <Tag severity="secondary" :value="'nm: ' + card.nomenclatureId" class="text-xs" />
            <Tag severity="secondary" :value="'Арт: ' + card.vendorCode" class="text-xs" />
            <Tag severity="secondary" :value="card.brand" class="text-xs" />
          </div>
          <div class="flex gap-1 mt-2 flex-wrap">
            <Tag v-for="size in card.sizes?.slice(0, 5)" :key="size.sku" severity="info" :value="size.techSize || 'б/р'"
              class="text-xs" />
            <span v-if="card.sizes?.length > 5" class="text-xs text-gray-400">+{{ card.sizes.length - 5 }}</span>
          </div>
          <div class="text-xs text-gray-400 mt-2">Обновлено: {{ formatDate(card.updatedAt) }}</div>
        </div>
      </div>
    </div>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { wbApi } from '@/api/client';
import type { WbCard } from '@/types';
import PageHeader from '@/components/common/PageHeader.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import Pagination from '@/components/common/Pagination.vue';
import Tag from 'primevue/tag';

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

const cards = ref<WbCard[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 20;

const filteredCards = computed(() => {
  if (!searchQuery.value) return cards.value;
  const q = searchQuery.value.toLowerCase();
  return cards.value.filter((card) =>
    card.vendorCode?.toLowerCase().includes(q) ||
    card.title?.toLowerCase().includes(q) ||
    card.brand?.toLowerCase().includes(q) ||
    String(card.nomenclatureId).includes(q)
  );
});

const statsData = computed(() => {
  const filtered = filteredCards.value;
  const total = filtered.length;
  const uniqueBrands = new Set(filtered.map((c) => c.brand).filter(Boolean)).size;
  const withPhotos = filtered.filter((c) => c.photos?.length).length;
  const updatedLastHour = filtered.filter(
    (c) => c.updatedAt && new Date().getTime() - new Date(c.updatedAt).getTime() < 3600000
  ).length;
  return [
    { label: 'Всего карточек', value: formatNumber(total) },
    { label: 'Уникальных брендов', value: formatNumber(uniqueBrands) },
    { label: 'С фото', value: formatNumber(withPhotos) },
    { label: 'Обновлено за час', value: formatNumber(updatedLastHour) },
  ];
});

const totalPages = computed(() => Math.ceil(filteredCards.value.length / pageSize));
const paginatedCards = computed(() =>
  filteredCards.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatDate = (dateString?: string): string =>
  dateString
    ? new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    : '—';

onMounted(async () => {
  try {
    const res = await wbApi.getCards({ limit: 1000 });
    const rawData = res.data.data as unknown as Record<string, unknown>[];
    cards.value = rawData.map((item) => toCamelCase<WbCard>(item));
  } catch (e) {
    console.error(e);
  }
});
</script>