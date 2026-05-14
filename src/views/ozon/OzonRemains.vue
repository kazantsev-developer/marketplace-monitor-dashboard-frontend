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
      <template #item_code="{ item }">{{ item.item_code || '—' }}</template>
      <template #name="{ item }">
        <div>
          <div class="font-medium">{{ item.name }}</div>
          <div class="text-xs text-gray-400">{{ item.category }}</div>
        </div>
      </template>
      <template #brand="{ item }">{{ item.brand || '—' }}</template>
      <template #fbo_visible_amount="{ item }">{{ formatNumber(item.fbo_visible_amount) }}</template>
      <template #fbo_present_amount="{ item }">{{ formatNumber(item.fbo_present_amount) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :pageSize="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ozonApi } from '../../api/client';
import PageHeader from '../../components/common/PageHeader.vue';
import DataTable from '../../components/common/DataTable.vue';
import StatsGrid from '../../components/common/StatsGrid.vue';
import FilterBar from '../../components/common/FilterBar.vue';
import SearchInput from '../../components/common/SearchInput.vue';
import SelectFilter from '../../components/common/SelectFilter.vue';
import Pagination from '../../components/common/Pagination.vue';

const remains = ref([]);
const brandFilter = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'item_code', label: 'Артикул' },
  { key: 'name', label: 'Товар' },
  { key: 'brand', label: 'Бренд' },
  { key: 'fbo_visible_amount', label: 'Доступно' },
  { key: 'fbo_present_amount', label: 'Всего' }
];

const brands = computed(() => [...new Set(remains.value.map(r => r.brand).filter(Boolean))].sort());
const brandOptions = computed(() => [{ value: '', label: 'Все бренды' }, ...brands.value.map(b => ({ value: b, label: b }))]);

const statsData = computed(() => {
  const filtered = filteredRemains.value;
  const totalSku = filtered.length;
  const totalVisible = filtered.reduce((s, r) => s + (r.fbo_visible_amount || 0), 0);
  const totalPresent = filtered.reduce((s, r) => s + (r.fbo_present_amount || 0), 0);
  const totalBrands = new Set(filtered.map(r => r.brand).filter(Boolean)).size;
  return [
    { label: 'Всего SKU', value: formatNumber(totalSku) },
    { label: 'Доступно', value: formatNumber(totalVisible) },
    { label: 'С резервом', value: formatNumber(totalPresent) },
    { label: 'Брендов', value: formatNumber(totalBrands) }
  ];
});

const filteredRemains = computed(() => {
  return remains.value.filter(item => {
    if (brandFilter.value && item.brand !== brandFilter.value) return false;
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (item.item_code?.toLowerCase().includes(q)) || (item.name?.toLowerCase().includes(q)) || String(item.sku).includes(q);
    }
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredRemains.value.length / pageSize));
const paginatedRemains = computed(() => filteredRemains.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));
const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);

onMounted(async () => {
  try { const res = await ozonApi.getRemains(); remains.value = res.data; } catch (e) { console.error(e); }
});
</script>