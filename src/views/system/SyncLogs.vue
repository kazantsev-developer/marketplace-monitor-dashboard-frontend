<template>
  <div class="sync-logs">
    <div class="container">
      <PageHeader title="Логи синхронизации" subtitle="История запусков скриптов" />

      <FilterBar>
        <SelectFilter v-model="selectedType">
          <option value="">Все типы</option>
          <option value="orders">Заказы</option>
          <option value="remains">Остатки</option>
          <option value="cards">Карточки</option>
          <option value="moysklad">МойСклад</option>
        </SelectFilter>
        <SelectFilter v-model="selectedStatus">
          <option value="">Все статусы</option>
          <option value="success">Успешно</option>
          <option value="error">Ошибка</option>
        </SelectFilter>
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <DataTable :columns="columns" :data="paginatedLogs">
        <template #status="{ item }">
          <span class="status-badge" :class="item.status"></span>
        </template>
        <template #entity_type="{ item }">
          {{ item.entity_type || 'orders' }}
        </template>
        <template #sync_at="{ item }">
          {{ formatDateTime(item.sync_at) }}
        </template>
        <template #records_count="{ item }">
          {{ formatNumber(item.records_count) }}
        </template>
        <template #execution_time_seconds="{ item }">
          {{ item.execution_time_seconds || 0 }} сек
        </template>
        <template #error_message="{ item }">
          <span v-if="item.error_message" class="error-badge" :title="item.error_message"></span>
          <span v-else>—</span>
        </template>
      </DataTable>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="currentPage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { systemApi } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatsGrid from '../../components/common/StatsGrid.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import SelectFilter from '../../components/common/SelectFilter.vue'
import Pagination from '../../components/common/Pagination.vue'

const logs = ref([])
const selectedType = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = 30

const columns = [
  { key: 'status', label: 'Статус' },
  { key: 'entity_type', label: 'Тип' },
  { key: 'sync_at', label: 'Время запуска' },
  { key: 'records_count', label: 'Записей' },
  { key: 'execution_time_seconds', label: 'Время' },
  { key: 'error_message', label: 'Ошибка' }
]

const statsData = computed(() => {
  const filtered = filteredLogs.value
  const total = filtered.length
  const success = filtered.filter(l => l.status === 'success').length
  const error = filtered.filter(l => l.status === 'error').length
  const successRate = total ? Math.round((success / total) * 100) : 0
  return [
    { label: 'Всего запусков', value: formatNumber(total) },
    { label: 'Успешно', value: formatNumber(success) },
    { label: 'Ошибок', value: formatNumber(error) },
    { label: 'Успешность', value: successRate + '%' }
  ]
})

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    if (selectedType.value && log.entity_type !== selectedType.value) return false
    if (selectedStatus.value && log.status !== selectedStatus.value) return false
    return true
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)
const formatDateTime = (date) => date ? new Date(date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'

onMounted(async () => {
  try {
    const response = await systemApi.getSyncLogs({ limit: 1000 })
    logs.value = response.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.sync-logs {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.status-badge {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 auto;
}

.status-badge.success {
  background: #4ade80;
}

.status-badge.error {
  background: #ff6b6b;
}

.error-badge {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffa500;
  cursor: help;
  margin: 0 auto;
}
</style>