<template>
  <div class="container mx-auto">
    <PageHeader title="Дашборд" subtitle="Общая статистика по всем системам" />

    <div v-if="loading" class="flex justify-center py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
    </div>
    <div v-else-if="error" class="bg-red-900/50 text-red-200 p-4 rounded-lg">{{ error }}</div>
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card class="bg-gray-900">
          <template #title><span class="text-sm text-gray-400">WILDBERRIES</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="Заказы" :value="formatNumber(stats.wb.orders)" />
              <StatsCard label="Остатки" :value="formatNumber(stats.wb.remains)" />
              <StatsCard label="Карточки" :value="formatNumber(stats.wb.cards)" />
            </div>
          </template>
        </Card>
        <Card class="bg-gray-900">
          <template #title><span class="text-sm text-gray-400">OZON</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="Заказы" :value="formatNumber(stats.ozon.orders)" />
              <StatsCard label="Остатки" :value="formatNumber(stats.ozon.remains)" />
            </div>
          </template>
        </Card>
        <Card class="bg-gray-900">
          <template #title><span class="text-sm text-gray-400">МОЙСКЛАД</span></template>
          <template #content>
            <StatsCard label="Всего остатков" :value="formatNumber(stats.moysklad.total_stock)" />
          </template>
        </Card>
        <Card class="bg-gray-900">
          <template #title><span class="text-sm text-gray-400">СИНХРОНИЗАЦИЯ</span></template>
          <template #content>
            <div class="space-y-2">
              <StatsCard label="За 24 часа" :value="formatNumber(stats.sync.last_24h)" />
              <StatsCard label="Успешность" :value="stats.sync.success_rate + '%'" />
            </div>
          </template>
        </Card>
      </div>

      <Card class="bg-gray-900 mb-8">
        <template #title><span class="text-sm text-gray-400">ДИНАМИКА ЗАКАЗОВ</span></template>
        <template #content>
          <OrdersChart v-if="chartData.length" :data="chartData" />
          <div v-else class="h-64 flex items-center justify-center text-gray-400">Нет данных</div>
        </template>
      </Card>

      <Card class="bg-gray-900">
        <template #title><span class="text-sm text-gray-400">ПОСЛЕДНИЕ СИНХРОНИЗАЦИИ</span></template>
        <template #content>
          <div class="flex justify-end mb-3"><Button as="router-link" to="/system/logs" text size="small">Все логи
              →</Button></div>
          <div v-if="logs.length === 0" class="text-center text-gray-400 py-4">Нет данных</div>
          <div v-else class="space-y-2">
            <div v-for="log in logs" :key="log.id" class="flex justify-between items-center p-2 rounded-lg bg-gray-800">
              <div class="flex items-center gap-2"><i
                  :class="log.status === 'success' ? 'pi pi-check-circle text-green-400' : 'pi pi-times-circle text-red-400'"></i>
                <div>
                  <div class="text-sm font-medium">{{ log.entity_type || 'orders' }}</div>
                  <div class="text-xs text-gray-400">{{ formatDate(log.sync_at) }}</div>
                </div>
              </div>
              <div class="text-sm text-gray-300">{{ log.records_count }} записей</div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { systemApi } from '../api/client';
import axios from 'axios';
import PageHeader from '../components/common/PageHeader.vue';
import StatsCard from '../components/common/StatsCard.vue';
import OrdersChart from '../components/common/OrdersChart.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const loading = ref(true);
const error = ref(null);
const stats = ref({ wb: { orders: 0, remains: 0, cards: 0 }, ozon: { orders: 0, remains: 0 }, moysklad: { total_stock: 0 }, sync: { last_24h: 0, success_rate: 0 } });
const logs = ref([]);
const chartData = ref([]);

const formatNumber = (n) => new Intl.NumberFormat('ru-RU').format(n || 0);
const formatDate = (d) => new Date(d).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

onMounted(async () => {
  try {
    const [statsRes, logsRes, chartRes] = await Promise.all([
      systemApi.getDashboardStats(),
      systemApi.getSyncLogs({ limit: 5 }),
      axios.get('http://localhost:3000/api/charts/orders-daily?days=30')
    ]);
    stats.value = statsRes.data;
    logs.value = logsRes.data;
    chartData.value = chartRes.data;
  } catch (e) {
    console.error(e);
    error.value = 'Не удалось загрузить данные';
  } finally {
    loading.value = false;
  }
});
</script>