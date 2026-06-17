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
  wbData: DailyChartPoint[]
  ozonData: DailyChartPoint[]
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

const buildChart = (): void => {
  if (!chartCanvas.value) return
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  const allDates = [...new Set([
    ...props.wbData.map(d => d.date),
    ...props.ozonData.map(d => d.date)
  ])].sort()

  const wbMap = new Map(props.wbData.map(d => [d.date, d.count]))
  const ozonMap = new Map(props.ozonData.map(d => [d.date, d.count]))

  const labels = allDates.map(formatDate)
  const wbValues = allDates.map(d => wbMap.get(d) ?? 0)
  const ozonValues = allDates.map(d => ozonMap.get(d) ?? 0)

  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = wbValues
    chartInstance.data.datasets[1].data = ozonValues
    chartInstance.update()
    return
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Wildberries',
          data: wbValues,
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
          data: ozonValues,
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
}

onMounted(buildChart)
watch(() => [props.wbData, props.ozonData], buildChart, { deep: true })
</script>

<style scoped>
.orders-chart {
  width: 100%;
  height: 320px;
}
</style>