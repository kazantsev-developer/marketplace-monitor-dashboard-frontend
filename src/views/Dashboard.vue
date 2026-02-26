<template>
  <div class="dashboard">
    <div class="container">
      <PageHeader title="Дашборд" subtitle="Общая статистика по всем системам" />

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка данных...</p>
      </div>

      <div v-else-if="error" class="error-state">{{ error }}</div>

      <div v-else>
        <div class="stats-grid">
          <div class="stat-card">
            <h3 class="stat-title">WILDBERRIES</h3>
            <div class="stat-list">
              <StatsCard label="Заказы" :value="formatNumber(stats.wb.orders)" />
              <StatsCard label="Остатки" :value="formatNumber(stats.wb.remains)" />
              <StatsCard label="Карточки" :value="formatNumber(stats.wb.cards)" />
            </div>
          </div>
          <div class="stat-card">
            <h3 class="stat-title">OZON</h3>
            <div class="stat-list">
              <StatsCard label="Заказы" :value="formatNumber(stats.ozon.orders)" />
              <StatsCard label="Остатки" :value="formatNumber(stats.ozon.remains)" />
            </div>
          </div>
          <div class="stat-card">
            <h3 class="stat-title">МОЙСКЛАД</h3>
            <div class="stat-list">
              <StatsCard label="Всего остатков" :value="formatNumber(stats.moysklad.total_stock)" />
            </div>
          </div>
          <div class="stat-card">
            <h3 class="stat-title">СИНХРОНИЗАЦИЯ</h3>
            <div class="stat-list">
              <StatsCard label="За 24 часа" :value="stats.sync.last_24h" />
              <StatsCard label="Успешность" :value="stats.sync.success_rate + '%'" />
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h3 class="section-title">ДИНАМИКА ЗАКАЗОВ</h3>
          <div v-if="chartLoading" class="chart-loading">
            <div class="spinner"></div>
            <p>Загрузка графика...</p>
          </div>
          <OrdersChart v-else-if="chartData.length" :data="chartData" />
          <div v-else class="chart-placeholder">
            <p>Нет данных для графика</p>
          </div>
        </div>

        <div class="logs-section">
          <div class="section-header">
            <h3 class="section-title">ПОСЛЕДНИЕ СИНХРОНИЗАЦИИ</h3>
            <router-link to="/system/logs" class="view-all-link">Все логи →</router-link>
          </div>
          <div v-if="logs.length === 0" class="empty-state">Нет данных о синхронизациях</div>
          <div v-else class="logs-list">
            <div v-for="log in logs" :key="log.id" class="log-item">
              <div class="log-info">
                <span class="log-status" :class="log.status"></span>
                <div class="log-details">
                  <div class="log-type">{{ log.entity_type || 'orders' }}</div>
                  <div class="log-time">{{ formatDate(log.sync_at) }}</div>
                </div>
              </div>
              <div class="log-count">{{ log.records_count }} записей</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { systemApi } from '../api/client'
import PageHeader from '../components/common/PageHeader.vue'
import StatsCard from '../components/common/StatsCard.vue'
import OrdersChart from '../components/common/OrdersChart.vue'

const loading = ref(true)
const chartLoading = ref(true)
const error = ref(null)
const stats = ref({ wb: { orders: 0, remains: 0, cards: 0 }, ozon: { orders: 0, remains: 0 }, moysklad: { total_stock: 0 }, sync: { last_24h: 0, success_rate: 0 } })
const logs = ref([])
const chartData = ref([])

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num)
const formatDate = (dateString) => new Date(dateString).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

onMounted(async () => {
  try {
    const statsResponse = await systemApi.getDashboardStats()
    stats.value = statsResponse.data

    const logsResponse = await systemApi.getSyncLogs({ limit: 5 })
    logs.value = logsResponse.data

    const chartResponse = await axios.get('http://localhost:3000/api/charts/orders-daily?days=30')
    chartData.value = chartResponse.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
    error.value = 'Не удалось загрузить данные'
  } finally {
    loading.value = false
    chartLoading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 60px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #e052c4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.2);
  border-radius: 12px;
  padding: 16px;
  color: #ff6b6b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.stat-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-container {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.chart-loading {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
}

.chart-loading .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #e052c4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.3);
}

.logs-section {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

.view-all-link {
  font-size: 13px;
  color: #fff;
  text-decoration: none;
  background: #e052c4;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.view-all-link:hover {
  background: #c73aa8;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.3);
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.log-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.log-status {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.log-status.success {
  background: #4ade80;
}

.log-status.error {
  background: #ff6b6b;
}

.log-details {
  display: flex;
  flex-direction: column;
}

.log-type {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 2px;
}

.log-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.log-count {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>