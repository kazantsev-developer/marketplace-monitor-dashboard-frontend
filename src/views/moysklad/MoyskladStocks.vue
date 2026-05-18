<template>
  <div class="container mx-auto">
    <PageHeader title="Остатки МойСклад" subtitle="Детализация остатков по складам" />
    <FilterBar>
      <SelectFilter v-model="selectedStore" :options="storeOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по товару или артикулу..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedStocks">
      <template #productName="{ item }">{{ item.productName || '—' }}</template>
      <template #article="{ item }">{{ item.article || '—' }}</template>
      <template #storeName="{ item }">{{ item.storeName || '—' }}</template>
      <template #stock="{ item }">{{ formatNumber(item.stock) }}</template>
      <template #reserve="{ item }">{{ formatNumber(item.reserve) }}</template>
      <template #inTransit="{ item }">{{ formatNumber(item.inTransit) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { moyskladApi } from '@/api/client';
import type { MoyskladStock, MoyskladStore } from '@/types';
import type { SelectOption } from '@/components/common/SelectFilter.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import SelectFilter from '@/components/common/SelectFilter.vue';
import Pagination from '@/components/common/Pagination.vue';

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

const stocks = ref < MoyskladStock[] > ([]);
const stores = ref < MoyskladStore[] > ([]);
const selectedStore = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'productName', label: 'Товар' },
  { key: 'article', label: 'Артикул' },
  { key: 'storeName', label: 'Склад' },
  { key: 'stock', label: 'Остаток' },
  { key: 'reserve', label: 'Резерв' },
  { key: 'inTransit', label: 'В пути' },
];

const storeOptions = computed < SelectOption[] > (() => [
  { value: '', label: 'Все склады' },
  ...stores.value.map((s) => ({ value: s.uuid, label: s.name })),
]);

const filteredStocks = computed(() => {
  return stocks.value.filter((item) => {
    if (selectedStore.value && item.storeUuid !== selectedStore.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (
        item.productName?.toLowerCase().includes(q) ||
        item.article?.toLowerCase().includes(q)
      );
    }
    return true;
  });
});

const statsData = computed(() => {
  const filtered = filteredStocks.value;
  const uniqueProducts = new Set(filtered.map((s) => s.productUuid));
  const totalStock = filtered.reduce((sum, s) => sum + (s.stock || 0), 0);
  return [
    { label: 'Всего товаров', value: formatNumber(uniqueProducts.size) },
    { label: 'Всего остатков', value: formatNumber(totalStock) },
    { label: 'Складов', value: stores.value.length },
  ];
});

const totalPages = computed(() => Math.ceil(filteredStocks.value.length / pageSize));
const paginatedStocks = computed(() =>
  filteredStocks.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try {
    const [stocksRes, storesRes] = await Promise.all([
      moyskladApi.getStocks(),
      moyskladApi.getStores(),
    ]);
    const rawStocks = stocksRes.data as unknown as Record<string, unknown>[];
    const rawStores = storesRes.data as unknown as Record<string, unknown>[];
    stocks.value = rawStocks.map((item) => toCamelCase < MoyskladStock > (item));
    stores.value = rawStores.map((item) => toCamelCase < MoyskladStore > (item));
  } catch (e) {
    console.error(e);
  }
});
</script>