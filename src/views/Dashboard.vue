<template>
  <div class="container mx-auto">
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
import { ref, onMounted } from 'vue';
import { systemApi } from '@/api/client';
import type { DashboardStats, DailyChartPoint, SyncLog } from '@/types';
import PageHeader from '@/components/common/PageHeader.vue';
import StatsCard from '@/components/common/StatsCard.vue';
import OrdersChart from '@/components/common/OrdersChart.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const loading = ref(true);
const error = ref<string | null>(null);
const stats = ref<DashboardStats>({
  wb: { orders: 0, remains: 0, cards: 0 },
  ozon: { orders: 0, remains: 0 },
  moysklad: { totalStock: 0 },
  sync: { last24h: 0, successRate: 0 },
});
const logs = ref<SyncLog[]>([]);
const chartData = ref<DailyChartPoint[]>([]);

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

function normalizeStats(raw: unknown): DashboardStats {
  const data = raw as Record<string, any>;
  return {
    wb: {
      orders: data.wb?.orders ?? 0,
      remains: data.wb?.remains ?? 0,
      cards: data.wb?.cards ?? 0,
    },
    ozon: {
      orders: data.ozon?.orders ?? 0,
      remains: data.ozon?.remains ?? 0,
    },
    moysklad: {
      totalStock: data.moysklad?.totalStock ?? data.moysklad?.total_stock ?? 0,
    },
    sync: {
      last24h: data.sync?.last24h ?? data.sync?.last_24h ?? 0,
      successRate: data.sync?.successRate ?? data.sync?.success_rate ?? 0,
    },
  };
}

function normalizeChart(raw: unknown): DailyChartPoint[] {
  const points = raw as any[];
  return points.map((p) => ({
    date: p.date,
    wbOrders: p.wbOrders ?? p.wb_orders ?? 0,
    ozonOrders: p.ozonOrders ?? p.ozon_orders ?? 0,
  }));
}

onMounted(async () => {
  try {
    const [statsRes, logsRes, chartRes] = await Promise.all([
      systemApi.getDashboardStats(),
      systemApi.getSyncLogs({ limit: 5 }),
      systemApi.getDailyChart(30),
    ]);

    stats.value = normalizeStats(statsRes.data);
    logs.value = logsRes.data;
    chartData.value = normalizeChart(chartRes.data);
  } catch (e) {
    console.error(e);
    error.value = 'Не удалось загрузить данные';
  } finally {
    loading.value = false;
  }
});
</script>