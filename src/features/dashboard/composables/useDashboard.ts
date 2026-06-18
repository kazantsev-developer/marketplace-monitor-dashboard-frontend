import { ref } from "vue";
import { systemApi } from "@/shared/api";
import type { DashboardStats, DailyChartPoint, SyncLog } from "@/shared/types";

export function useDashboard() {
  const loading = ref<boolean>(true);
  const error = ref<string | null>(null);
  const stats = ref<DashboardStats>({
    wb: { orders: 0, remains: 0, cards: 0 },
    ozon: { orders: 0, remains: 0 },
    moysklad: { totalStock: 0 },
    sync: { last24h: 0, successRate: 0 },
  });
  const logs = ref<SyncLog[]>([]);
  const chartData = ref<DailyChartPoint[]>([]);

  async function fetchData(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const [statsRes, logsRes, chartRes] = await Promise.all([
        systemApi.getDashboardStats(),
        systemApi.getSyncLogs({ limit: 5 }),
        systemApi.getDailyChart(30),
      ]);
      stats.value = statsRes.data;
      logs.value = logsRes.data;
      chartData.value = chartRes.data;
    } catch (e) {
      console.error(e);
      error.value = "Не удалось загрузить данные";
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    stats,
    logs,
    chartData,
    fetchData,
  };
}
