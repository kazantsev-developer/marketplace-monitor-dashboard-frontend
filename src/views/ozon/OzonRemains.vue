<template>
  <div class="ozon-remains">
    <div class="container">
      <PageHeader title="Остатки Ozon" subtitle="Текущие остатки FBO" />

      <FilterBar>
        <SelectFilter v-model="brandFilter">
          <option value="">Все бренды</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </SelectFilter>
        <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или названию..." />
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedRemains">
        <template #sku="{ item }">
          {{ item.sku }}
        </template>
        <template #item_code="{ item }">
          {{ item.item_code || '—' }}
        </template>
        <template #name="{ item }">
          <div class="product-info">
            <span class="product-name">{{ item.name }}</span>
            <span class="product-category">{{ item.category }}</span>
          </div>
        </template>
        <template #brand="{ item }">
          {{ item.brand || '—' }}
        </template>
        <template #fbo_visible_amount="{ item }">
          {{ formatNumber(item.fbo_visible_amount) }}
        </template>
        <template #fbo_present_amount="{ item }">
          {{ formatNumber(item.fbo_present_amount) }}
        </template>
      </DataTable>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="currentPage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ozonApi } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatsGrid from '../../components/common/StatsGrid.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import SelectFilter from '../../components/common/SelectFilter.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import Pagination from '../../components/common/Pagination.vue'

const remains = ref([])
const brandFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 30

const columns = [
  { key: 'sku', label: 'SKU' },
  { key: 'item_code', label: 'Артикул' },
  { key: 'name', label: 'Товар' },
  { key: 'brand', label: 'Бренд' },
  { key: 'fbo_visible_amount', label: 'Доступно' },
  { key: 'fbo_present_amount', label: 'Всего' }
]

const brands = computed(() => {
  const b = new Set(remains.value.map(r => r.brand).filter(Boolean))
  return Array.from(b).sort()
})

const statsData = computed(() => {
  const filtered = filteredRemains.value
  const totalSku = filtered.length
  const totalVisible = filtered.reduce((sum, r) => sum + (r.fbo_visible_amount || 0), 0)
  const totalPresent = filtered.reduce((sum, r) => sum + (r.fbo_present_amount || 0), 0)
  const totalBrands = new Set(filtered.map(r => r.brand).filter(Boolean)).size
  return [
    { label: 'Всего SKU', value: formatNumber(totalSku) },
    { label: 'Доступно', value: formatNumber(totalVisible) },
    { label: 'С резервом', value: formatNumber(totalPresent) },
    { label: 'Брендов', value: formatNumber(totalBrands) }
  ]
})

const filteredRemains = computed(() => {
  return remains.value.filter(item => {
    if (brandFilter.value && item.brand !== brandFilter.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (item.item_code && item.item_code.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        String(item.sku).includes(q)
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
    const response = await ozonApi.getRemains()
    remains.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.ozon-remains {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}

.product-name {
  font-weight: 500;
  color: #fff;
}

.product-category {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
</style>