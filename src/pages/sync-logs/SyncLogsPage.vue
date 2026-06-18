<template>
  <div class="container mx-auto" data-testid="sync-logs-page">
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
      <template #syncAt="{ item }">{{ formatDate(item.syncAt) }}</template>
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
import { onMounted } from 'vue'
import { useSyncLogs } from '@/features/sync-logs/composables/useSyncLogs'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { SyncLog } from '@/shared/types'
import { formatNumber, formatDate } from '@/shared/lib/formatters'

const {
  selectedType,
  selectedStatus,
  currentPage,
  pageSize,
  typeOptions,
  statusOptions,
  statsData,
  totalPages,
  paginatedLogs,
  fetchLogs,
} = useSyncLogs()

const columns: ColumnDef<SyncLog>[] = [
  { key: 'status', label: 'Статус' },
  { key: 'entityType', label: 'Тип' },
  { key: 'syncAt', label: 'Время запуска' },
  { key: 'recordsCount', label: 'Записей' },
  { key: 'executionTimeSeconds', label: 'Время' },
  { key: 'errorMessage', label: 'Ошибка' },
]

onMounted(fetchLogs)
</script>