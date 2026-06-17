<template>
  <div class="container mx-auto">
    <PageHeader title="Заказы Wildberries" subtitle="Список заказов за последние 30 дней" />

    <FilterBar>
      <InputText type="date" v-model="dateFrom" class="w-40" :max="dateTo" />
      <InputText type="date" v-model="dateTo" class="w-40" :min="dateFrom" :max="today" />
      <SelectFilter v-model="statusFilter" :options="statusOptions" placeholder="Статус" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или заказу..." />
    </FilterBar>

    <StatsGrid :stats="statsData" />

    <DataTable :columns="columns" :data="paginatedOrders">
      <template #date="{ item }">{{ formatDate(item.date) }}</template>
      <template #orderNumber="{ item }">{{ item.orderNumber || '—' }}</template>
      <template #supplierArticle="{ item }">{{ item.supplierArticle || '—' }}</template>
      <template #product="{ item }">
        <div>
          <div class="font-medium">{{ item.brand }} {{ item.category }}</div>
          <div class="text-xs text-gray-400">nm: {{ item.nomenclatureId }}</div>
        </div>
      </template>
      <template #techSize="{ item }">{{ item.techSize || '—' }}</template>
      <template #totalPrice="{ item }"><span class="font-mono">{{ formatMoney(item.totalPrice) }}</span></template>
      <template #warehouseName="{ item }">{{ item.warehouseName || '—' }}</template>
      <template #destinationCity="{ item }">{{ item.destinationCity || '—' }}</template>
      <template #status="{ item }">
        <Tag :severity="item.isCanceled ? 'danger' : 'success'" :value="item.isCanceled ? 'Отменен' : 'Активен'" />
      </template>
    </DataTable>

    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { wbApi } from '@/shared/api/client';
import type { WbOrder } from '@/types';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
import SearchInput from '@/components/common/SearchInput.vue';
import SelectFilter, { type SelectOption } from '@/components/common/SelectFilter.vue';
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

const statusOptions: SelectOption[] = [
  { value: '', label: 'Все статусы' },
  { value: 'true', label: 'Только отмененные' },
  { value: 'false', label: 'Только активные' },
];

const orders = ref<WbOrder[]>([]);
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
  { key: 'orderNumber', label: 'Номер заказа' },
  { key: 'supplierArticle', label: 'Артикул' },
  { key: 'product', label: 'Товар' },
  { key: 'techSize', label: 'Размер' },
  { key: 'totalPrice', label: 'Сумма', align: 'right' as const },
  { key: 'warehouseName', label: 'Склад' },
  { key: 'destinationCity', label: 'Город' },
  { key: 'status', label: 'Статус' },
];

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    if (dateFrom.value && order.date < dateFrom.value) return false;
    if (dateTo.value && order.date > dateTo.value) return false;
    if (statusFilter.value !== '') {
      const isCancel = statusFilter.value === 'true';
      if (order.isCanceled !== isCancel) return false;
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      return (
        order.supplierArticle?.toLowerCase().includes(q) ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.brand?.toLowerCase().includes(q)
      );
    }
    return true;
  });
});

const statsData = computed(() => {
  const filtered = filteredOrders.value;
  const total = filtered.length;
  const totalSum = filtered.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const cancelled = filtered.filter((o) => o.isCanceled).length;
  const uniqueProducts = new Set(filtered.map((o) => o.nomenclatureId)).size;
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'Отменено', value: formatNumber(cancelled) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) },
  ];
});

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize));
const paginatedOrders = computed(() =>
  filteredOrders.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatMoney = (n: number): string =>
  n ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(n) : '0 ₽';
const formatDate = (d: string): string => (d ? new Date(d).toLocaleString('ru-RU') : '—');

onMounted(async () => {
  try {
    const res = await wbApi.getOrders({ limit: 1000 });
    const rawData = res.data.data as unknown as Record<string, unknown>[];
    orders.value = rawData.map((item) => toCamelCase<WbOrder>(item));
  } catch (e) {
    console.error(e);
  }
});
</script>