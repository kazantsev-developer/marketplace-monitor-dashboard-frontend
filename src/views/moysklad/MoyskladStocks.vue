<template>
  <div class="moysklad-stocks">
    <div class="container">
      <PageHeader title="Остатки МойСклад" subtitle="Детализация остатков по складам" />

      <FilterBar>
        <SelectFilter v-model="selectedStore">
          <option value="">Все склады</option>
          <option v-for="store in stores" :key="store.uuid" :value="store.uuid">{{ store.name }}</option>
        </SelectFilter>
        <SearchInput v-model="searchQuery" placeholder="Поиск по товару или артикулу..." />
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedStocks">
        <template #product_name="{ item }">
          {{ item.product_name || '—' }}
        </template>
        <template #article="{ item }">
          {{ item.article || '—' }}
        </template>
        <template #store_name="{ item }">
          {{ item.store_name || '—' }}
        </template>
        <template #stock="{ item }">
          {{ formatNumber(item.stock) }}
        </template>
        <template #reserve="{ item }">
          {{ formatNumber(item.reserve) }}
        </template>
        <template #in_transit="{ item }">
          {{ formatNumber(item.in_transit) }}
        </template>
      </DataTable>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="currentPage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { moyskladApi } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatsGrid from '../../components/common/StatsGrid.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import SelectFilter from '../../components/common/SelectFilter.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import Pagination from '../../components/common/Pagination.vue'

const stocks = ref([])
const stores = ref([])
const selectedStore = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 30

const columns = [
  { key: 'product_name', label: 'Товар' },
  { key: 'article', label: 'Артикул' },
  { key: 'store_name', label: 'Склад' },
  { key: 'stock', label: 'Остаток' },
  { key: 'reserve', label: 'Резерв' },
  { key: 'in_transit', label: 'В пути' }
]

const statsData = computed(() => {
  const uniqueProducts = new Set(filteredStocks.value.map(s => s.product_uuid))
  const totalStock = filteredStocks.value.reduce((sum, s) => sum + (s.stock || 0), 0)
  return [
    { label: 'Всего товаров', value: formatNumber(uniqueProducts.size) },
    { label: 'Всего остатков', value: formatNumber(totalStock) },
    { label: 'Складов', value: stores.value.length }
  ]
})

const filteredStocks = computed(() => {
  return stocks.value.filter(item => {
    if (selectedStore.value && item.store_uuid !== selectedStore.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (item.product_name && item.product_name.toLowerCase().includes(q)) ||
        (item.article && item.article.toLowerCase().includes(q))
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredStocks.value.length / pageSize))
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredStocks.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)

onMounted(async () => {
  try {
    const [stocksRes, storesRes] = await Promise.all([
      moyskladApi.getStocks(),
      moyskladApi.getStores()
    ])
    stocks.value = stocksRes.data
    stores.value = storesRes.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.moysklad-stocks {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>