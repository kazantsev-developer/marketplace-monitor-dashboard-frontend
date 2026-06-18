<template>
  <div class="container mx-auto" data-testid="ozon-orders-page">
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
        {{ formatMoney(getOrderTotal(item)) }}
      </template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOzonOrders } from '@/features/ozon-orders/composables/useOzonOrders'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { OzonOrder } from '@/shared/types'
import { formatMoney, formatDate } from '@/shared/lib/formatters'

const {
  schemeFilter,
  statusFilter,
  dateFrom,
  dateTo,
  currentPage,
  pageSize,
  today,
  schemeOptions,
  statusOptions,
  statsData,
  totalPages,
  paginatedOrders,
  statusSeverity,
  fetchOrders,
  getOrderTotal,
} = useOzonOrders()

const columns: ColumnDef<OzonOrder>[] = [
  { key: 'postingNumber', label: 'Номер отправления' },
  { key: 'createdAt', label: 'Дата' },
  { key: 'status', label: 'Статус' },
  { key: 'scheme', label: 'Схема' },
  { key: 'products', label: 'Товары' },
  { key: 'financialData' as keyof OzonOrder, label: 'Сумма', align: 'right' },
]

onMounted(fetchOrders)
</script>