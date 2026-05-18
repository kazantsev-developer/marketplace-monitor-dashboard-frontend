<template>
  <div class="container mx-auto">
    <PageHeader title="Остатки Wildberries" subtitle="Текущие остатки на складах" />
    <FilterBar>
      <SelectFilter v-model="selectedWarehouse" :options="warehouseOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или штрихкоду..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedRemains">
      <template #nomenclatureId="{ item }">{{ item.nomenclatureId }}</template>
      <template #size="{ item }">{{ item.size || '—' }}</template>
      <template #barcode="{ item }">{{ item.barcode || '—' }}</template>
      <template #warehouse="{ item }">{{ item.warehouse }}</template>
      <template #quantity="{ item }">{{ formatNumber(item.quantity) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { wbApi } from '@/api/client';
import type { WbRemain } from '@/types';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import SelectFilter, { type SelectOption } from '@/components/common/SelectFilter.vue';
import Pagination from '@/components/common/Pagination.vue';

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

const remains = ref < WbRemain[] > ([]);
const selectedWarehouse = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'nomenclatureId', label: 'Артикул' },
  { key: 'size', label: 'Размер' },
  { key: 'barcode', label: 'Штрихкод' },
  { key: 'warehouse', label: 'Склад' },
  { key: 'quantity', label: 'Количество' },
];

const warehouses = computed(() => {
  const unique = new Set(remains.value.map((r) => r.warehouse));
  return Array.from(unique).sort();
});

const warehouseOptions = computed < SelectOption[] > (() => [
  { value: '', label: 'Все склады' },
  ...warehouses.value.map((w) => ({ value: w, label: w })),
]);

const filteredRemains = computed(() => {
  return remains.value.filter((item) => {
    if (selectedWarehouse.value && item.warehouse !== selectedWarehouse.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (
        String(item.nomenclatureId).includes(q) ||
        (item.barcode && item.barcode.toLowerCase().includes(q))
      );
    }
    return true;
  });
});

const statsData = computed(() => {
  const filtered = filteredRemains.value;
  const totalItems = filtered.length;
  const totalQuantity = filtered.reduce((s, r) => s + (r.quantity || 0), 0);
  const uniqueProducts = new Set(filtered.map((r) => r.nomenclatureId)).size;
  return [
    { label: 'Всего позиций', value: formatNumber(totalItems) },
    { label: 'Всего товаров', value: formatNumber(totalQuantity) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) },
    { label: 'Складов', value: warehouses.value.length },
  ];
});

const totalPages = computed(() => Math.ceil(filteredRemains.value.length / pageSize));
const paginatedRemains = computed(() =>
  filteredRemains.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try {
    const res = await wbApi.getRemains();
    const rawData = res.data as unknown as Record<string, unknown>[];
    remains.value = rawData.map((item) => toCamelCase < WbRemain > (item));
  } catch (e) {
    console.error(e);
  }
});
</script>