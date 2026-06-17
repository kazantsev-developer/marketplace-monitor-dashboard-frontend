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
      <template #postingNumber="{ item }">{{ item.postingNumber || '—' }}</template>
      <template #createdAt="{ item }">{{ formatDate(item.createdAt) }}</template>
      <template #status="{ item }">
        <Tag :severity="statusSeverity(item.status)" :value="item.status || '—'" />
      </template>
      <template #scheme="{ item }">
        <Tag :severity="item.scheme === 'FBO' ? 'primary' : 'secondary'" :value="item.scheme || '—'" />
      </template>
      <template #products="{ item }">{{ item.products?.length || 0 }} шт.</template>
      <template #total="{ item }">
        {{formatMoney(item.financialData?.products?.reduce((sum: number, product: { price: number }) => sum + (product.price || 0), 0))}}
      </template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ozonApi } from '@/shared/api/client';
import type { OzonOrder } from '@/types';
import type { SelectOption } from '@/components/common/SelectFilter.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import SelectFilter from '@/components/common/SelectFilter.vue';
import Pagination from '@/components/common/Pagination.vue';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';

function toCamelCase<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = value;
  }
  return result as T;
}

const orders = ref<OzonOrder[]>([]);
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

const schemeOptions: SelectOption[] = [
  { value: '', label: 'Все схемы' },
  { value: 'FBO', label: 'FBO' },
  { value: 'FBS', label: 'FBS' },
];
const statusOptions: SelectOption[] = [
  { value: '', label: 'Все статусы' },
  { value: 'delivered', label: 'Доставлено' },
  { value: 'cancelled', label: 'Отменено' },
  { value: 'awaiting_packaging', label: 'Ожидает упаковки' },
];

const columns = [
  { key: 'postingNumber', label: 'Номер отправления' },
  { key: 'createdAt', label: 'Дата' },
  { key: 'status', label: 'Статус' },
  { key: 'scheme', label: 'Схема' },
  { key: 'products', label: 'Товары' },
  { key: 'total', label: 'Сумма', align: 'right' as const },
];

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    if (schemeFilter.value && order.scheme !== schemeFilter.value) return false;
    if (statusFilter.value && order.status !== statusFilter.value) return false;
    if (dateFrom.value && order.createdAt && order.createdAt < dateFrom.value) return false;
    if (dateTo.value && order.createdAt && order.createdAt > dateTo.value) return false;
    return true;
  });
});

const statsData = computed(() => {
  const filtered = filteredOrders.value;
  const total = filtered.length;
  const totalSum = filtered.reduce(
    (sum, o) => sum + (o.financialData?.products?.reduce((s, p) => s + (p.price || 0), 0) || 0),
    0
  );
  const fbo = filtered.filter((o) => o.scheme === 'FBO').length;
  const fbs = filtered.filter((o) => o.scheme === 'FBS').length;
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'FBO', value: formatNumber(fbo) },
    { label: 'FBS', value: formatNumber(fbs) },
  ];
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize));
const paginatedOrders = computed(() =>
  filteredOrders.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatMoney = (n: number): string =>
  n ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(n) : '0 ₽';
const formatDate = (d?: string): string => (d ? new Date(d).toLocaleString('ru-RU') : '—');
const statusSeverity = (s: string): string => {
  if (s === 'delivered') return 'success';
  if (s === 'cancelled') return 'danger';
  if (s === 'awaiting_packaging') return 'warning';
  return 'info';
};

onMounted(async () => {
  try {
    const res = await ozonApi.getOrders({ limit: 1000 });
    const rawData = res.data.data as unknown as Record<string, unknown>[];
    orders.value = rawData.map((item) => toCamelCase<OzonOrder>(item));
  } catch (e) {
    console.error(e);
  }
});
</script>