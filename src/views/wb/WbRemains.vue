<template>
  <div class="wb-remains">
    <div class="container">
      <PageHeader title="Остатки Wildberries" subtitle="Текущие остатки на складах" />

      <FilterBar>
        <SelectFilter v-model="selectedWarehouse">
          <option value="">Все склады</option>
          <option v-for="warehouse in warehouses" :key="warehouse" :value="warehouse">{{ warehouse }}</option>
        </SelectFilter>
        <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или штрихкоду..." />
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedRemains">
        <template #nm_id="{ item }">
          {{ item.nm_id }}
        </template>
        <template #size="{ item }">
          {{ item.size || '—' }}
        </template>
        <template #barcode="{ item }">
          {{ item.barcode || '—' }}
        </template>
        <template #warehouse="{ item }">
          {{ item.warehouse }}
        </template>
        <template #quantity="{ item }">
          {{ formatNumber(item.quantity) }}
        </template>
      </DataTable>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="currentPage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { wbApi } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatsGrid from '../../components/common/StatsGrid.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import SelectFilter from '../../components/common/SelectFilter.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import Pagination from '../../components/common/Pagination.vue'

const remains = ref([])
const selectedWarehouse = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 30

const columns = [
  { key: 'nm_id', label: 'Артикул' },
  { key: 'size', label: 'Размер' },
  { key: 'barcode', label: 'Штрихкод' },
  { key: 'warehouse', label: 'Склад' },
  { key: 'quantity', label: 'Количество' }
]

const warehouses = computed(() => {
  const wh = new Set(remains.value.map(r => r.warehouse))
  return Array.from(wh).sort()
})

const statsData = computed(() => {
  const filtered = filteredRemains.value
  const totalItems = filtered.length
  const totalQuantity = filtered.reduce((sum, r) => sum + (r.quantity || 0), 0)
  const uniqueProducts = new Set(filtered.map(r => r.nm_id)).size
  return [
    { label: 'Всего позиций', value: formatNumber(totalItems) },
    { label: 'Всего товаров', value: formatNumber(totalQuantity) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) },
    { label: 'Складов', value: warehouses.value.length }
  ]
})

const filteredRemains = computed(() => {
  return remains.value.filter(item => {
    if (selectedWarehouse.value && item.warehouse !== selectedWarehouse.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return String(item.nm_id).includes(q) ||
        (item.barcode && item.barcode.toLowerCase().includes(q))
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredRemains.value.length / pageSize))
const paginatedRemains = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRemains.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)

onMounted(async () => {
  try {
    const response = await wbApi.getRemains()
    remains.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.wb-remains {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}
</style>