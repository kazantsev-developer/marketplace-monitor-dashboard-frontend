<template>
  <div class="container mx-auto" data-testid="dashboard-page">
    <PageHeader title="Дашборд" subtitle="Общая статистика по всем системам" />

    <div v-if="loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
    </div>
    <div v-else-if="error" class="bg-red-900/50 text-red-200 p-4 rounded-lg">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card class="bg-gray-800 border-gray-700">
          <template #title><span class="text-sm text-gray-400">WILDBERRIES</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="Заказы" :value="stats.wb.orders" />
              <StatsCard label="Остатки" :value="stats.wb.remains" />
              <StatsCard label="Карточки" :value="stats.wb.cards" />
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title><span class="text-sm text-gray-400">OZON</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="Заказы" :value="stats.ozon.orders" />
              <StatsCard label="Остатки" :value="stats.ozon.remains" />
            </div>
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title><span class="text-sm text-gray-400">МОЙСКЛАД</span></template>
          <template #content>
            <StatsCard label="Всего остатков" :value="stats.moysklad.totalStock" />
          </template>
        </Card>
        <Card class="bg-gray-800 border-gray-700">
          <template #title><span class="text-sm text-gray-400">СИНХРОНИЗАЦИЯ</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="За 24 часа" :value="stats.sync.last24h" />
              <StatsCard label="Успешность" :value="stats.sync.successRate + '%'" />
            </div>
          </template>
        </Card>
      </div>

      <Card class="bg-gray-800 border-gray-700 mb-8">
        <template #title><span class="text-sm text-gray-400">ДИНАМИКА ЗАКАЗОВ</span></template>
        <template #content>
          <OrdersChart v-if="chartData.length" :data="chartData" />
          <div v-else class="h-64 flex items-center justify-center text-gray-400">Нет данных</div>
        </template>
      </Card>

      <Card class="bg-gray-800 border-gray-700">
        <template #title><span class="text-sm text-gray-400">ПОСЛЕДНИЕ СИНХРОНИЗАЦИИ</span></template>
        <template #content>
          <div class="flex justify-end mb-3">
            <Button as="router-link" to="/system/logs" text size="small" class="text-gray-300">Все логи →</Button>
          </div>
          <div v-if="logs.length === 0" class="text-center text-gray-400 py-4">Нет данных о синхронизациях</div>
          <div v-else class="space-y-2">
            <div v-for="log in logs" :key="log.id" class="flex justify-between items-center p-2 rounded-lg bg-gray-700">
              <div class="flex items-center gap-2">
                <i :class="log.status === 'success' ? 'pi pi-check-circle text-gray-400' : 'pi pi-times-circle text-gray-500'"
                  class="text-lg"></i>
                <div>
                  <div class="text-sm font-medium text-white">
                    {{ log.entityType === 'orders' ? 'Заказы' : log.entityType === 'remains' ? 'Остатки' : log.entityType === 'cards' ? 'Карточки' : 'МойСклад' }}
                  </div>
                  <div class="text-xs text-gray-400">{{ formatDate(log.syncAt) }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-300">{{ log.recordsCount }} записей</div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboard } from '@/features/dashboard/composables/useDashboard'
import { PageHeader } from '@/shared/ui/page-header'
import { StatsCard } from '@/shared/ui/stats-card'
import { OrdersChart } from '@/shared/ui/orders-chart'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { formatDate } from '@/shared/lib/formatters'

const { loading, error, stats, logs, chartData, fetchData } = useDashboard()

onMounted(fetchData)
</script>