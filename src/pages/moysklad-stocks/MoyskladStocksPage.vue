<template>
  <div class="container mx-auto" data-testid="moysklad-stocks-page">
    <PageHeader title="Остатки МойСклад" subtitle="Детализация остатков по складам" />
    <FilterBar>
      <SelectFilter v-model="selectedStore" :options="storeOptions" placeholder="Все склады" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по товару или артикулу..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedStocks">
      <template #productName="{ item }">{{ item.productName || '—' }}</template>
      <template #article="{ item }">{{ item.article || '—' }}</template>
      <template #storeName="{ item }">{{ item.storeName || '—' }}</template>
      <template #stock="{ item }">{{ formatNumber(item.stock) }}</template>
      <template #reserve="{ item }">{{ formatNumber(item.reserve) }}</template>
      <template #inTransit="{ item }">{{ formatNumber(item.inTransit) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMoySkladStocks } from '@/features/moysklad-stocks/composables/useMoySkladStocks'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SearchInput } from '@/shared/ui/search-input'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { MoyskladStock } from '@/shared/types'
import { formatNumber } from '@/shared/lib/formatters'

const {
  selectedStore,
  searchQuery,
  currentPage,
  pageSize,
  storeOptions,
  statsData,
  totalPages,
  paginatedStocks,
  fetchData,
} = useMoySkladStocks()

const columns: ColumnDef<MoyskladStock>[] = [
  { key: 'productName', label: 'Товар' },
  { key: 'article', label: 'Артикул' },
  { key: 'storeName', label: 'Склад' },
  { key: 'stock', label: 'Остаток' },
  { key: 'reserve', label: 'Резерв' },
  { key: 'inTransit', label: 'В пути' },
]

onMounted(fetchData)
</script>