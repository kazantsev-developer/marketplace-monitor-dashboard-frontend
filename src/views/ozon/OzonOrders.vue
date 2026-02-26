<template>
  <div class="ozon-orders">
    <div class="container">
      <PageHeader title="Заказы Ozon" subtitle="FBO и FBS заказы" />

      <FilterBar>
        <SelectFilter v-model="schemeFilter">
          <option value="">Все схемы</option>
          <option value="FBO">FBO</option>
          <option value="FBS">FBS</option>
        </SelectFilter>
        <SelectFilter v-model="statusFilter">
          <option value="">Все статусы</option>
          <option value="delivered">Доставлено</option>
          <option value="cancelled">Отменено</option>
          <option value="awaiting_packaging">Ожидает упаковки</option>
        </SelectFilter>
        <input type="date" v-model="dateFrom" class="filter-input" :max="dateTo">
        <input type="date" v-model="dateTo" class="filter-input" :min="dateFrom" :max="today">
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedOrders">
        <template #posting_number="{ item }">
          {{ item.posting_number || '—' }}
        </template>
        <template #created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
        <template #status="{ item }">
          <span class="status-badge" :class="item.status">{{ item.status || '—' }}</span>
        </template>
        <template #scheme="{ item }">
          <span class="scheme-badge" :class="item.scheme">{{ item.scheme || '—' }}</span>
        </template>
        <template #products="{ item }">
          {{ item.products?.length || 0 }} шт.
        </template>
        <template #total="{ item }">
          {{formatMoney(item.financial_data?.products?.reduce((sum, p) => sum + (p.price || 0), 0))}}
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
import Pagination from '../../components/common/Pagination.vue'

const orders = ref([])
const schemeFilter = ref('')
const statusFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const currentPage = ref(1)
const pageSize = 20

const today = new Date().toISOString().split('T')[0]
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
dateFrom.value = thirtyDaysAgo
dateTo.value = today

const columns = [
  { key: 'posting_number', label: 'Номер отправления' },
  { key: 'created_at', label: 'Дата' },
  { key: 'status', label: 'Статус' },
  { key: 'scheme', label: 'Схема' },
  { key: 'products', label: 'Товары' },
  { key: 'total', label: 'Сумма', align: 'right' }
]

const statsData = computed(() => {
  const filtered = filteredOrders.value
  const total = filtered.length
  const totalSum = filtered.reduce((sum, o) => sum + (o.financial_data?.products?.reduce((s, p) => s + (p.price || 0), 0) || 0), 0)
  const fbo = filtered.filter(o => o.scheme === 'FBO').length
  const fbs = filtered.filter(o => o.scheme === 'FBS').length
  return [
    { label: 'Всего заказов', value: formatNumber(total) },
    { label: 'На сумму', value: formatMoney(totalSum) },
    { label: 'FBO', value: formatNumber(fbo) },
    { label: 'FBS', value: formatNumber(fbs) }
  ]
})

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    if (schemeFilter.value && order.scheme !== schemeFilter.value) return false
    if (statusFilter.value && order.status !== statusFilter.value) return false
    if (dateFrom.value && order.created_at < dateFrom.value) return false
    if (dateTo.value && order.created_at > dateTo.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / pageSize))
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)
const formatMoney = (num) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(num || 0)
const formatDate = (date) => date ? new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(async () => {
  try {
    const response = await ozonApi.getOrders({ limit: 1000 })
    orders.value = response.data.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.ozon-orders {
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
  border-color: #002dff;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.delivered {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
}

.status-badge.cancelled {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.status-badge.awaiting_packaging {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.scheme-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.scheme-badge.FBO {
  background: rgba(0, 45, 255, 0.1);
  color: #4a6eff;
}

.scheme-badge.FBS {
  background: rgba(156, 39, 176, 0.1);
  color: #9c27b0;
}

@media (max-width: 768px) {
  .filter-input {
    width: 100%;
  }
}
</style>