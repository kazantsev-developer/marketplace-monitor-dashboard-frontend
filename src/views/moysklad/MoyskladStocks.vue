<template>
  <div class="container mx-auto">
    <PageHeader title="Остатки МойСклад" subtitle="Детализация остатков по складам" />
    <FilterBar>
      <SelectFilter v-model="selectedStore" :options="storeOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по товару или артикулу..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedStocks">
      <template #product_name="{ item }">{{ item.product_name || '—' }}</template>
      <template #article="{ item }">{{ item.article || '—' }}</template>
      <template #store_name="{ item }">{{ item.store_name || '—' }}</template>
      <template #stock="{ item }">{{ formatNumber(item.stock) }}</template>
      <template #reserve="{ item }">{{ formatNumber(item.reserve) }}</template>
      <template #in_transit="{ item }">{{ formatNumber(item.in_transit) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :pageSize="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { moyskladApi } from '../../api/client';
import PageHeader from '../../components/common/PageHeader.vue';
import DataTable from '../../components/common/DataTable.vue';
import StatsGrid from '../../components/common/StatsGrid.vue';
import FilterBar from '../../components/common/FilterBar.vue';
import SearchInput from '../../components/common/SearchInput.vue';
import SelectFilter from '../../components/common/SelectFilter.vue';
import Pagination from '../../components/common/Pagination.vue';

const stocks = ref([]);
const stores = ref([]);
const selectedStore = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'product_name', label: 'Товар' },
  { key: 'article', label: 'Артикул' },
  { key: 'store_name', label: 'Склад' },
  { key: 'stock', label: 'Остаток' },
  { key: 'reserve', label: 'Резерв' },
  { key: 'in_transit', label: 'В пути' }
];

const storeOptions = computed(() => [{ value: '', label: 'Все склады' }, ...stores.value.map(s => ({ value: s.uuid, label: s.name }))]);

const statsData = computed(() => {
  const filtered = filteredStocks.value;
  const uniqueProducts = new Set(filtered.map(s => s.product_uuid));
  const totalStock = filtered.reduce((sum, s) => sum + (s.stock || 0), 0);
  return [
    { label: 'Всего товаров', value: formatNumber(uniqueProducts.size) },
    { label: 'Всего остатков', value: formatNumber(totalStock) },
    { label: 'Складов', value: stores.value.length }
  ];
});

const filteredStocks = computed(() => {
  return stocks.value.filter(item => {
    if (selectedStore.value && item.store_uuid !== selectedStore.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (item.product_name?.toLowerCase().includes(q)) || (item.article?.toLowerCase().includes(q));
    }
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredStocks.value.length / pageSize));
const paginatedStocks = computed(() => filteredStocks.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));
const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try {
    const [stocksRes, storesRes] = await Promise.all([moyskladApi.getStocks(), moyskladApi.getStores()]);
    stocks.value = stocksRes.data;
    stores.value = storesRes.data;
  } catch (e) { console.error(e); }
});
</script>