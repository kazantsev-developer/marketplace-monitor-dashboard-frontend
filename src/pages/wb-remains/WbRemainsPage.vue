<template>
  <div class="container mx-auto" data-testid="wb-remains-page">
    <PageHeader title="Остатки Wildberries" subtitle="Текущие остатки на складах" />
    <FilterBar>
      <SelectFilter v-model="selectedWarehouse" :options="warehouseOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или штрихкоду..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedRemains">
      <template #nmId="{ item }">{{ item.nmId }}</template>
      <template #size="{ item }">{{ item.size || '—' }}</template>
      <template #barcode="{ item }">{{ item.barcode || '—' }}</template>
      <template #warehouse="{ item }">{{ item.warehouse }}</template>
      <template #quantity="{ item }">{{ formatNumber(item.quantity) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWbRemains } from '@/features/wb-remains/composables/useWbRemains'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SearchInput } from '@/shared/ui/search-input'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { WbRemain } from '@/shared/types'
import { formatNumber } from '@/shared/lib/formatters'

const {
  selectedWarehouse,
  searchQuery,
  currentPage,
  pageSize,
  warehouseOptions,
  statsData,
  totalPages,
  paginatedRemains,
  fetchRemains,
} = useWbRemains()

const columns: ColumnDef<WbRemain>[] = [
  { key: 'nmId', label: 'Артикул' },
  { key: 'size', label: 'Размер' },
  { key: 'barcode', label: 'Штрихкод' },
  { key: 'warehouse', label: 'Склад' },
  { key: 'quantity', label: 'Количество' },
]

onMounted(fetchRemains)
</script>