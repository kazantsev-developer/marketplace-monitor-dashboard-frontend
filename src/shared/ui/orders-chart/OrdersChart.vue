<template>
  <div data-testid="orders-chart">
    <div class="flex justify-center gap-8 mb-4">
      <span class="text-sm cursor-pointer transition-colors" :class="{ 'opacity-40 line-through': !wbVisible }"
        :style="{ color: wbVisible ? '#3b82f6' : '#9ca3af' }" @click="toggleDataset('wb')"
        data-testid="orders-chart-legend-wb">
        Wildberries
      </span>
      <span class="text-sm cursor-pointer transition-colors" :class="{ 'opacity-40 line-through': !ozonVisible }"
        :style="{ color: ozonVisible ? '#ec4899' : '#9ca3af' }" @click="toggleDataset('ozon')"
        data-testid="orders-chart-legend-ozon">
        Ozon
      </span>
    </div>
    <div class="orders-chart">
      <canvas ref="chartCanvas" data-testid="orders-chart-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import type { Chart as ChartType } from 'chart.js'
import type { DailyChartPoint } from '@/shared/types'

Chart.register(...registerables)

const props = defineProps<{
  data: DailyChartPoint[]
}>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartType | null = null
const wbVisible = ref<boolean>(true)
const ozonVisible = ref<boolean>(true)

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })

const toggleDataset = (dataset: 'wb' | 'ozon'): void => {
  if (dataset === 'wb') wbVisible.value = !wbVisible.value
  else ozonVisible.value = !ozonVisible.value

  if (chartInstance) {
    chartInstance.data.datasets[0].hidden = !wbVisible.value
    chartInstance.data.datasets[1].hidden = !ozonVisible.value
    chartInstance.update()
  }
}

onMounted(() => {
  if (!props.data.length || !chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.map((d) => formatDate(d.date)),
      datasets: [
        {
          label: 'Wildberries',
          data: props.data.map((d) => d.wbOrders),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          tension: 0.3,
          fill: true,
          hidden: false,
        },
        {
          label: 'Ozon',
          data: props.data.map((d) => d.ozonOrders),
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236,72,153,0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#ffffff',
          tension: 0.3,
          fill: true,
          hidden: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: {
          grid: { color: '#f3f4f6' },
          ticks: { color: '#6b7280', font: { size: 11 } },
        },
        y: {
          grid: { color: '#f3f4f6' },
          ticks: { color: '#6b7280', font: { size: 11 }, stepSize: 1 },
          beginAtZero: true,
        },
      },
    },
  })
})

watch(
  () => props.data,
  (newData) => {
    if (!chartInstance) return
    chartInstance.data.labels = newData.map((d) => formatDate(d.date))
    chartInstance.data.datasets[0].data = newData.map((d) => d.wbOrders)
    chartInstance.data.datasets[1].data = newData.map((d) => d.ozonOrders)
    chartInstance.update()
  },
  { deep: true }
)
</script>

<style scoped>
.orders-chart {
  width: 100%;
  height: 320px;
}
</style>