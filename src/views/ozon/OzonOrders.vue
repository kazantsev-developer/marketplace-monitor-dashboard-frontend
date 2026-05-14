<template>
  <div class="container mx-auto">
    <PageHeader title="Заказы Ozon" subtitle="FBO и FBS заказы" />
    <FilterBar>
      <SelectFilter v-model="schemeFilter" :options="schemeOptions" placeholder="Все схемы" />
      <SelectFilter v-model="statusFilter" :options="statusOptions" placeholder="Все статусы" />
      <InputText type="date" v-model="dateFrom" class="w-40" :max="dateTo" />
      <InputText type="date" v-model="dateTo" class="w-40" :min="dateFrom" :max="today" />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedOrders">
      <template #posting_number="{ item }">{{ item.posting_number || '—' }}</template>
      <template #created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #status="{ item }">
        <Tag :severity="statusSeverity(item.status)" :value="item.status || '—'" />
      </template>
      <template #scheme="{ item }">
        <Tag :severity="item.scheme === 'FBO' ? 'primary' : 'secondary'" :value="item.scheme || '—'" />
      </template>
      <template #products="{ item }">{{ item.products?.length || 0 }} шт.</template>
      <template
        #total="{ item }">{{formatMoney(item.financial_data?.products?.reduce((s, p) => s + (p.price || 0), 0))}}</template>
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
import SelectFilter from '../../components/common/SelectFilter.vue';
import Pagination from '../../components/common/Pagination.vue';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

const orders = ref([]);
const schemeFilter = ref('');
const statusFilter = ref('');
const dateFrom = ref('');
const dateTo = ref('');
const currentPage = ref(1);
const pageSize = 20;
const today = new Date().toISOString().split('T')[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
dateFrom.value = thirtyDaysAgo;
dateTo.value = today;

const schemeOptions = [{ value: '', label: 'Все схемы' }, { value: 'FBO', label: 'FBO' }, { value: 'FBS', label: 'FBS' }];
const statusOptions = [
  { value: '', label: 'Все статусы' },
  { value: 'delivered', label: 'Доставлено' },
  { value: 'cancelled', label: 'Отменено' },
  { value: 'awaiting_packaging', label: 'Ожидает упаковки' }
];

const columns = [
  { key: 'posting_number', label: 'Номер отправления' },
  { key: 'created_at', label: 'Дата' },
  { key: 'status', label: 'Статус' },
  { key: 'scheme', label: 'Схема' },
  { key: 'products', label: 'Товары' },
  { key: 'total', label: 'Сумма', align: 'right' }
];

const statsData = computed(() => {
  const filtered = filteredOrders.value;
  const total = filtered.length;
  const totalSum = filtered.reduce((sum, o) => sum + (o.financial_data?.products?.reduce((s, p) => s + (p.price || 0), 0) || 0), 0);
  const fbo = filtered.filter(o => o.scheme === 'FBO').length;
  const fbs = filtered.filter(o => o.scheme === 'FBS').length;
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'FBO', value: formatNumber(fbo) },
    { label: 'FBS', value: formatNumber(fbs) }
  ];
});

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (schemeFilter.value && order.scheme !== schemeFilter.value) return false;
    if (statusFilter.value && order.status !== statusFilter.value) return false;
    if (dateFrom.value && order.created_at < dateFrom.value) return false;
    if (dateTo.value && order.created_at > dateTo.value) return false;
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize));
const paginatedOrders = computed(() => filteredOrders.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize));

const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatMoney = (n) => n ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(n) : '0 ₽';
const formatDate = (d) => d ? new Date(d).toLocaleString('ru-RU') : '—';
const statusSeverity = (s) => {
  if (s === 'delivered') return 'success';
  if (s === 'cancelled') return 'danger';
  if (s === 'awaiting_packaging') return 'warning';
  return 'info';
};

onMounted(async () => {
  try { const res = await ozonApi.getOrders({ limit: 1000 }); orders.value = res.data.data; } catch (e) { console.error(e); }
});
</script>