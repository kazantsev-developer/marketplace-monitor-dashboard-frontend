<template>
  <div class="container mx-auto" data-testid="wb-orders-page">
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
      <template #srid="{ item }">{{ item.srid || '—' }}</template>
      <template #supplierArticle="{ item }">{{ item.supplierArticle || '—' }}</template>
      <template #brand="{ item }">
        <div>
          <div class="font-medium">{{ item.brand }} {{ item.category }}</div>
          <div class="text-xs text-gray-400">nm: {{ item.nmId }}</div>
        </div>
      </template>
      <template #techSize="{ item }">{{ item.techSize || '—' }}</template>
      <template #totalPrice="{ item }">
        <span class="font-mono">{{ formatMoney(item.totalPrice) }}</span>
      </template>
      <template #warehouseName="{ item }">{{ item.warehouseName || '—' }}</template>
      <template #destCityName="{ item }">{{ item.destCityName || '—' }}</template>
      <template #isCancel="{ item }">
        <Tag :severity="item.isCancel ? 'danger' : 'success'" :value="item.isCancel ? 'Отменен' : 'Активен'" />
      </template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWbOrders } from '@/features/wb-orders/composables/useWbOrders'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SearchInput } from '@/shared/ui/search-input'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { WbOrder } from '@/shared/types'
import { formatMoney, formatDate } from '@/shared/lib/formatters'

const {
  dateFrom,
  dateTo,
  statusFilter,
  searchQuery,
  currentPage,
  pageSize,
  today,
  statusOptions,
  statsData,
  totalPages,
  paginatedOrders,
  fetchOrders,
} = useWbOrders()

const columns: ColumnDef<WbOrder>[] = [
  { key: 'date', label: 'Дата' },
  { key: 'srid', label: 'Номер заказа' },
  { key: 'supplierArticle', label: 'Артикул' },
  { key: 'brand', label: 'Товар' },
  { key: 'techSize', label: 'Размер' },
  { key: 'totalPrice', label: 'Сумма', align: 'right' },
  { key: 'warehouseName', label: 'Склад' },
  { key: 'destCityName', label: 'Город' },
  { key: 'isCancel', label: 'Статус' },
]

onMounted(fetchOrders)
</script>