<template>
  <div class="container mx-auto">
    <PageHeader title="Остатки Ozon" subtitle="Текущие остатки FBO" />
    <FilterBar>
      <SelectFilter v-model="brandFilter" :options="brandOptions" placeholder="Все бренды" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или названию..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedRemains">
      <template #sku="{ item }">{{ item.sku }}</template>
      <template #itemCode="{ item }">{{ item.itemCode || '—' }}</template>
      <template #name="{ item }">
        <div>
          <div class="font-medium">{{ item.name }}</div>
          <div class="text-xs text-gray-400">{{ item.category }}</div>
        </div>
      </template>
      <template #brand="{ item }">{{ item.brand || '—' }}</template>
      <template #fboVisibleAmount="{ item }">{{ formatNumber(item.fboVisibleAmount) }}</template>
      <template #fboPresentAmount="{ item }">{{ formatNumber(item.fboPresentAmount) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ozonApi } from '@/shared/api/client';
import type { OzonRemain } from '@/types';
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

const remains = ref<OzonRemain[]>([]);
const brandFilter = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'itemCode', label: 'Артикул' },
  { key: 'name', label: 'Товар' },
  { key: 'brand', label: 'Бренд' },
  { key: 'fboVisibleAmount', label: 'Доступно' },
  { key: 'fboPresentAmount', label: 'Всего' },
];

const brands = computed(() => {
  const unique = new Set(remains.value.map((r) => r.brand).filter(Boolean));
  return Array.from(unique).sort() as string[];
});

const brandOptions = computed<SelectOption[]>(() => [
  { value: '', label: 'Все бренды' },
  ...brands.value.map((b) => ({ value: b, label: b })),
]);

const filteredRemains = computed(() => {
  return remains.value.filter((item) => {
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
  });
});

const statsData = computed(() => {
  const filtered = filteredRemains.value;
  const totalSku = filtered.length;
  const totalVisible = filtered.reduce((s, r) => s + (r.fboVisibleAmount || 0), 0);
  const totalPresent = filtered.reduce((s, r) => s + (r.fboPresentAmount || 0), 0);
  const totalBrands = new Set(filtered.map((r) => r.brand).filter(Boolean)).size;
  return [
    { label: 'Всего SKU', value: formatNumber(totalSku) },
    { label: 'Доступно', value: formatNumber(totalVisible) },
    { label: 'С резервом', value: formatNumber(totalPresent) },
    { label: 'Брендов', value: formatNumber(totalBrands) },
  ];
});

const totalPages = computed(() => Math.ceil(filteredRemains.value.length / pageSize));
const paginatedRemains = computed(() =>
  filteredRemains.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try {
    const res = await ozonApi.getRemains();
    const rawData = res.data as unknown as Record<string, unknown>[];
    remains.value = rawData.map((item) => toCamelCase<OzonRemain>(item));
  } catch (e) {
    console.error(e);
  }
});
</script>