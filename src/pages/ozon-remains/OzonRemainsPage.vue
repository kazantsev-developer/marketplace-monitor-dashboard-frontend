<template>
  <div class="container mx-auto" data-testid="ozon-remains-page">
    <PageHeader title="Остатки Ozon" subtitle="Текущие остатки FBO" />
    <FilterBar>
      <SelectFilter v-model="brandFilter" :options="brandOptions" placeholder="Все бренды" />
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или названию..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <DataTable :columns="columns" :data="paginatedRemains">
      <template #sku="{ item }">{{ item.sku }}</template>
      <template #itemCode="{ item }">{{ item.itemCode || '—' }}</template>
      <template #name="{ item }">
        <div>
          <div class="font-medium">{{ item.name }}</div>
          <div class="text-xs text-gray-400">{{ item.category }}</div>
        </div>
      </template>
      <template #brand="{ item }">{{ item.brand || '—' }}</template>
      <template #fboVisibleAmount="{ item }">{{ formatNumber(item.fboVisibleAmount) }}</template>
      <template #fboPresentAmount="{ item }">{{ formatNumber(item.fboPresentAmount) }}</template>
    </DataTable>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOzonRemains } from '@/features/ozon-remains/composables/useOzonRemains'
import { PageHeader } from '@/shared/ui/page-header'
import { DataTable } from '@/shared/ui/data-table'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SearchInput } from '@/shared/ui/search-input'
import { SelectFilter } from '@/shared/ui/select-filter'
import { Pagination } from '@/shared/ui/pagination'
import type { ColumnDef } from '@/shared/ui/data-table/types'
import type { OzonRemain } from '@/shared/types'
import { formatNumber } from '@/shared/lib/formatters'

const {
  brandFilter,
  searchQuery,
  currentPage,
  pageSize,
  brandOptions,
  statsData,
  totalPages,
  paginatedRemains,
  fetchRemains,
} = useOzonRemains()

const columns: ColumnDef<OzonRemain>[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'itemCode', label: 'Артикул' },
  { key: 'name', label: 'Товар' },
  { key: 'brand', label: 'Бренд' },
  { key: 'fboVisibleAmount', label: 'Доступно' },
  { key: 'fboPresentAmount', label: 'Всего' },
]

onMounted(fetchRemains)
</script>