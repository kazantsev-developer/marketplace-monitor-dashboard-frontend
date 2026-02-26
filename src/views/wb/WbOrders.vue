<template>
  <div class="wb-orders">
    <div class="container">
      <PageHeader title="Заказы Wildberries" subtitle="Список заказов за последние 30 дней" />

      <FilterBar>
        <input type="date" v-model="dateFrom" class="filter-input" :max="dateTo">
        <input type="date" v-model="dateTo" class="filter-input" :min="dateFrom" :max="today">
        <SelectFilter v-model="statusFilter">
          <option value="">Все статусы</option>
          <option value="true">Только отмененные</option>
          <option value="false">Только активные</option>
        </SelectFilter>
        <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу или заказу..." />
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedOrders">
        <template #date="{ item }">
          {{ formatDate(item.date) }}
        </template>
        <template #g_number="{ item }">
          {{ item.g_number || '—' }}
        </template>
        <template #supplier_article="{ item }">
          {{ item.supplier_article || '—' }}
        </template>
        <template #product="{ item }">
          <div class="product-info">
            <span class="product-name">{{ item.brand }} {{ item.category }}</span>
            <span class="product-id">nm: {{ item.nm_id }}</span>
          </div>
        </template>
        <template #tech_size="{ item }">
          {{ item.tech_size || '—' }}
        </template>
        <template #total_price="{ item }">
          <span class="text-right">{{ formatMoney(item.total_price) }}</span>
        </template>
        <template #warehouse_name="{ item }">
          {{ item.warehouse_name || '—' }}
        </template>
        <template #dest_city_name="{ item }">
          {{ item.dest_city_name || '—' }}
        </template>
        <template #status="{ item }">
          <span class="status-badge" :class="{ cancelled: item.is_cancel }">
            {{ item.is_cancel ? 'Отменен' : 'Активен' }}
          </span>
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

const orders = ref([])
const dateFrom = ref('')
const dateTo = ref('')
const statusFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 20

const today = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
dateFrom.value = thirtyDaysAgo
dateTo.value = today

const columns = [
  { key: 'date', label: 'Дата' },
  { key: 'g_number', label: 'Номер заказа' },
  { key: 'supplier_article', label: 'Артикул' },
  { key: 'product', label: 'Товар' },
  { key: 'tech_size', label: 'Размер' },
  { key: 'total_price', label: 'Сумма', align: 'right' },
  { key: 'warehouse_name', label: 'Склад' },
  { key: 'dest_city_name', label: 'Город' },
  { key: 'status', label: 'Статус' }
]

const statsData = computed(() => {
  const filtered = filteredOrders.value
  const total = filtered.length
  const totalSum = filtered.reduce((sum, o) => sum + (o.total_price || 0), 0)
  const cancelled = filtered.filter(o => o.is_cancel).length
  const uniqueProducts = new Set(filtered.map(o => o.nm_id)).size
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'Отменено', value: formatNumber(cancelled) },
    { label: 'Уникальных товаров', value: formatNumber(uniqueProducts) }
  ]
})

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (dateFrom.value && order.date < dateFrom.value) return false
    if (dateTo.value && order.date > dateTo.value) return false
    if (statusFilter.value !== '') {
      const isCancel = statusFilter.value === 'true'
      if (order.is_cancel !== isCancel) return false
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return (order.supplier_article?.toLowerCase().includes(q)) ||
        (order.g_number?.toLowerCase().includes(q)) ||
        (order.brand?.toLowerCase().includes(q))
    }
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)
const formatMoney = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0 ₽';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(num);
}
const formatDate = (date) => date ? new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(async () => {
  try {
    const response = await wbApi.getOrders({ limit: 1000 })
    orders.value = response.data.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.wb-orders {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.filter-input {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  font-size: 14px;
  width: 160px;
}

.filter-input:focus {
  outline: none;
  border-color: #e052c4;
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

.product-id {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.status-badge.cancelled {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .filter-input {
    width: 100%;
  }
}
</style>