<template>
  <div class="orders-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

onMounted(() => {
  if (props.data.length === 0) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(d => formatDate(d.date)),
      datasets: [
        {
          label: 'Wildberries',
          data: props.data.map(d => d.wb_orders),
          borderColor: '#4a6eff',
          backgroundColor: 'rgba(74, 110, 255, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Ozon',
          data: props.data.map(d => d.ozon_orders),
          borderColor: '#e052c4',
          backgroundColor: 'rgba(224, 82, 196, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#fff'
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          },
          beginAtZero: true
        }
      }
    }
  })
})

watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.data.labels = newData.map(d => formatDate(d.date))
    chartInstance.data.datasets[0].data = newData.map(d => d.wb_orders)
    chartInstance.data.datasets[1].data = newData.map(d => d.ozon_orders)
    chartInstance.update()
  }
}, { deep: true })
</script>

<style scoped>
.orders-chart {
  width: 100%;
  height: 300px;
}
</style>