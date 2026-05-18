<template>
  <div class="container mx-auto">
    <PageHeader title="Логи синхронизации" subtitle="История запусков скриптов" />
    <FilterBar>
      <SelectFilter v-model="selectedType" :options="typeOptions" placeholder="Все типы" />
      <SelectFilter v-model="selectedStatus" :options="statusOptions" placeholder="Все статусы" />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedLogs">
      <template #status="{ item }">
        <i :class="item.status === 'success' ? 'pi pi-check-circle text-gray-700' : 'pi pi-times-circle text-gray-400'"
          class="text-xl mx-auto block w-fit"></i>
      </template>
      <template #entityType="{ item }">{{ item.entityType || 'orders' }}</template>
      <template #syncAt="{ item }">{{ formatDateTime(item.syncAt) }}</template>
      <template #recordsCount="{ item }">{{ formatNumber(item.recordsCount) }}</template>
      <template #executionTimeSeconds="{ item }">{{ item.executionTimeSeconds || 0 }} сек</template>
      <template #errorMessage="{ item }">
        <span v-if="item.errorMessage" class="cursor-help" :title="item.errorMessage">
          <i class="pi pi-exclamation-triangle text-gray-500"></i>
        </span>
        <span v-else>—</span>
      </template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { systemApi } from '@/api/client';
import type { SyncLog } from '@/types';
import type { SelectOption } from '@/components/common/SelectFilter.vue';
import PageHeader from '@/components/common/PageHeader.vue';
import DataTable from '@/components/common/DataTable.vue';
import StatsGrid from '@/components/common/StatsGrid.vue';
import FilterBar from '@/components/common/FilterBar.vue';
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

const logs = ref < SyncLog[] > ([]);
const selectedType = ref('');
const selectedStatus = ref('');
const currentPage = ref(1);
const pageSize = 30;

const columns = [
  { key: 'status', label: 'Статус' },
  { key: 'entityType', label: 'Тип' },
  { key: 'syncAt', label: 'Время запуска' },
  { key: 'recordsCount', label: 'Записей' },
  { key: 'executionTimeSeconds', label: 'Время' },
  { key: 'errorMessage', label: 'Ошибка' },
];

const typeOptions: SelectOption[] = [
  { value: '', label: 'Все типы' },
  { value: 'orders', label: 'Заказы' },
  { value: 'remains', label: 'Остатки' },
  { value: 'cards', label: 'Карточки' },
  { value: 'moysklad', label: 'МойСклад' },
];
const statusOptions: SelectOption[] = [
  { value: '', label: 'Все статусы' },
  { value: 'success', label: 'Успешно' },
  { value: 'error', label: 'Ошибка' },
];

const filteredLogs = computed(() => {
  return logs.value.filter((log) => {
    if (selectedType.value && log.entityType !== selectedType.value) return false;
    if (selectedStatus.value && log.status !== selectedStatus.value) return false;
    return true;
  });
});

const statsData = computed(() => {
  const filtered = filteredLogs.value;
  const total = filtered.length;
  const success = filtered.filter((l) => l.status === 'success').length;
  const error = filtered.filter((l) => l.status === 'error').length;
  const successRate = total ? Math.round((success / total) * 100) : 0;
  return [
    { label: 'Всего запусков', value: formatNumber(total) },
    { label: 'Успешно', value: formatNumber(success) },
    { label: 'Ошибок', value: formatNumber(error) },
    { label: 'Успешность', value: successRate + '%' },
  ];
});

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize));
const paginatedLogs = computed(() =>
  filteredLogs.value.slice((currentPage.value - 1) * pageSize, currentPage.value * pageSize)
);

const formatNumber = (n: number): string => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatDateTime = (d?: string): string => (d ? new Date(d).toLocaleString('ru-RU') : '—');

onMounted(async () => {
  try {
    const res = await systemApi.getSyncLogs({ limit: 1000 });
    const rawData = res.data as unknown as Record<string, unknown>[];
    logs.value = rawData.map((item) => toCamelCase < SyncLog > (item));
  } catch (e) {
    console.error(e);
  }
});
</script>