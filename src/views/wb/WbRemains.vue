<template>
  <div class="container mx-auto">
    <PageHeader title="Остатки Wildberries" subtitle="Текущие остатки на складах" />
    <FilterBar>
      <SelectFilter v-model="selectedWarehouse" :options="warehouseOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или штрихкоду..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedRemains">
      <template #nm_id="{ item }">{{ item.nm_id }}</template>
      <template #size="{ item }">{{ item.size || '—' }}</template>
      <template #barcode="{ item }">{{ item.barcode || '—' }}</template>
      <template #warehouse="{ item }">{{ item.warehouse }}</template>
      <template #quantity="{ item }">{{ formatNumber(item.quantity) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :pageSize="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { wbApi } from '../../api/client';
import PageHeader from '../../components/common/PageHeader.vue';
import DataTable from '../../components/common/DataTable.vue';
import StatsGrid from '../../components/common/StatsGrid.vue';
import FilterBar from '../../components/common/FilterBar.vue';
import SearchInput from '../../components/common/SearchInput.vue';
import SelectFilter from '../../components/common/SelectFilter.vue';
import Pagination from '../../components/common/Pagination.vue';

const remains = ref([]);
const selectedWarehouse = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'nm_id', label: 'Артикул' },
  { key: 'size', label: 'Размер' },
  { key: 'barcode', label: 'Штрихкод' },
  { key: 'warehouse', label: 'Склад' },
  { key: 'quantity', label: 'Количество' }
];

const warehouses = computed(() => [...new Set(remains.value.map(r => r.warehouse))].sort());
const warehouseOptions = computed(() => [{ value: '', label: 'Все склады' }, ...warehouses.value.map(w => ({ value: w, label: w }))]);

const statsData = computed(() => {
  const filtered = filteredRemains.value;
  const totalItems = filtered.length;
  const totalQuantity = filtered.reduce((s, r) => s + (r.quantity || 0), 0);
  const uniqueProducts = new Set(filtered.map(r => r.nm_id)).size;
  return [
    { label: 'Всего позиций', value: formatNumber(totalItems) },
    { label: 'Всего товаров', value: formatNumber(totalQuantity) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) },
    { label: 'Складов', value: warehouses.value.length }
  ];
});

const filteredRemains = computed(() => {
  return remains.value.filter(item => {
    if (selectedWarehouse.value && item.warehouse !== selectedWarehouse.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return String(item.nm_id).includes(q) || (item.barcode && item.barcode.toLowerCase().includes(q));
    }
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredRemains.value.length / pageSize));
const paginatedRemains = computed(() => filteredRemains.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));

const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try { const res = await wbApi.getRemains(); remains.value = res.data; } catch (e) { console.error(e); }
});
</script>