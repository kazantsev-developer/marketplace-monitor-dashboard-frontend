<template>
  <div class="container mx-auto">
    <PageHeader title="Заказы Wildberries" subtitle="Список заказов за последние 30 дней" />

    <FilterBar>
      <InputText type="date" v-model="dateFrom" class="w-40" :max="dateTo" />
      <InputText type="date" v-model="dateTo" class="w-40" :min="dateFrom" :max="today" />
      <SelectFilter v-model="statusFilter"
        :options="[{ value: '', label: 'Все статусы' }, { value: 'true', label: 'Только отмененные' }, { value: 'false', label: 'Только активные' }]"
        placeholder="Статус" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или заказу..." />
    </FilterBar>

    <StatsGrid :stats="statsData" />

    <DataTable :columns="columns" :data="paginatedOrders">
      <template #date="{ item }">{{ formatDate(item.date) }}</template>
      <template #g_number="{ item }">{{ item.g_number || '—' }}</template>
      <template #supplier_article="{ item }">{{ item.supplier_article || '—' }}</template>
      <template #product="{ item }">
        <div>
          <div class="font-medium">{{ item.brand }} {{ item.category }}</div>
          <div class="text-xs text-gray-400">nm: {{ item.nm_id }}</div>
        </div>
      </template>
      <template #tech_size="{ item }">{{ item.tech_size || '—' }}</template>
      <template #total_price="{ item }"><span class="font-mono">{{ formatMoney(item.total_price) }}</span></template>
      <template #warehouse_name="{ item }">{{ item.warehouse_name || '—' }}</template>
      <template #dest_city_name="{ item }">{{ item.dest_city_name || '—' }}</template>
      <template #status="{ item }">
        <Tag :severity="item.is_cancel ? 'danger' : 'success'" :value="item.is_cancel ? 'Отменен' : 'Активен'" />
      </template>
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
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

const orders = ref([]);
const dateFrom = ref('');
const dateTo = ref('');
const statusFilter = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 20;

const today = new Date().toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
dateFrom.value = thirtyDaysAgo;
dateTo.value = today;

const columns = [
  { key: 'date', label: 'Дата' },
  { key: 'g_number', label: 'Номер заказа' },
  { key: 'supplier_article', label: 'Артикул' },
  { key: 'product', label: 'Товар' },
  { key: 'tech_size', label: 'Размер' },
  { key: 'total_price', label: 'Сумма', align: 'right' },
  { key: 'warehouse_name', label: 'Склад' },
  { key: 'dest_city_name', label: 'Город' },
  { key: 'status', label: 'Статус' }
];

const statsData = computed(() => {
  const filtered = filteredOrders.value;
  const total = filtered.length;
  const totalSum = filtered.reduce((s, o) => s + (o.total_price || 0), 0);
  const cancelled = filtered.filter(o => o.is_cancel).length;
  const uniqueProducts = new Set(filtered.map(o => o.nm_id)).size;
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'Отменено', value: formatNumber(cancelled) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) }
  ];
});

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (dateFrom.value && order.date < dateFrom.value) return false;
    if (dateTo.value && order.date > dateTo.value) return false;
    if (statusFilter.value !== '') {
      const isCancel = statusFilter.value === 'true';
      if (order.is_cancel !== isCancel) return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (order.supplier_article?.toLowerCase().includes(q)) ||
        (order.g_number?.toLowerCase().includes(q)) ||
        (order.brand?.toLowerCase().includes(q));
    }
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize));
const paginatedOrders = computed(() => filteredOrders.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));

const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatMoney = (n) => n ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(n) : '0 ₽';
const formatDate = (d) => d ? new Date(d).toLocaleString('ru-RU') : '—';

onMounted(async () => {
  try {
    const res = await wbApi.getOrders({ limit: 1000 });
    orders.value = res.data.data;
  } catch (e) { console.error(e); }
});
</script>