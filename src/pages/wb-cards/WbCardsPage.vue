<template>
  <div class="container mx-auto max-w-7xl" data-testid="wb-cards-page">
    <PageHeader title="Карточки товаров Wildberries" subtitle="Список всех товаров" />
    <FilterBar>
      <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу, названию или бренду..." />
    </FilterBar>
    <StatsGrid :stats="statsData" />
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-6 auto-rows-fr">
      <div v-for="card in paginatedCards" :key="card.nmId"
        class="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-md transition-shadow h-full">
        <div class="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img v-if="card.photos?.[0]" :src="card.photos[0].big" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">Нет фото</div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 truncate">{{ card.title || 'Без названия' }}</h3>
          <div class="flex flex-wrap gap-1 mt-1">
            <Tag severity="secondary" :value="'nm: ' + card.nmId" class="text-xs" />
            <Tag severity="secondary" :value="'Арт: ' + card.vendorCode" class="text-xs" />
            <Tag severity="secondary" :value="card.brand" class="text-xs" />
          </div>
          <div class="flex gap-1 mt-2 flex-wrap">
            <Tag v-for="size in card.sizes?.slice(0, 5)" :key="size.sku" severity="info" :value="size.techSize || 'б/р'"
              class="text-xs" />
            <span v-if="card.sizes && card.sizes.length > 5"
              class="text-xs text-gray-400">+{{ card.sizes.length - 5 }}</span>
          </div>
          <div class="text-xs text-gray-400 mt-2">Обновлено: {{ formatDate(card.updatedAt) }}</div>
        </div>
      </div>
    </div>
    <Pagination :current-page="currentPage" :total-pages="totalPages" :page-size="pageSize"
      @page-change="currentPage = $event" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWbCards } from '@/features/wb-cards/composables/useWbCards'
import { PageHeader } from '@/shared/ui/page-header'
import { StatsGrid } from '@/shared/ui/stats-grid'
import { FilterBar } from '@/shared/ui/filter-bar'
import { SearchInput } from '@/shared/ui/search-input'
import { Pagination } from '@/shared/ui/pagination'
import Tag from 'primevue/tag'
import { formatDate } from '@/shared/lib/formatters'

const {
  searchQuery,
  currentPage,
  pageSize,
  statsData,
  totalPages,
  paginatedCards,
  fetchCards,
} = useWbCards()

onMounted(fetchCards)
</script>