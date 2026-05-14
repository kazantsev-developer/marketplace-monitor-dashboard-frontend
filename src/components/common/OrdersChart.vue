<template>
  <div>
    <div class="flex justify-center gap-8 mb-4">
      <span class="text-sm cursor-pointer transition-colors" :class="{ 'opacity-40 line-through': !wbVisible }"
        :style="{ color: wbVisible ? '#3b82f6' : '#9ca3af' }" @click="toggleDataset('wb')">
        Wildberries
      </span>
      <span class="text-sm cursor-pointer transition-colors" :class="{ 'opacity-40 line-through': !ozonVisible }"
        :style="{ color: ozonVisible ? '#ec4899' : '#9ca3af' }" @click="toggleDataset('ozon')">
        Ozon
      </span>
    </div>
    <div class="orders-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({ data: { type: Array, required: true } });
const chartCanvas = ref(null);
let chartInstance = null;
const wbVisible = ref(true);
const ozonVisible = ref(true);

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

const toggleDataset = (dataset) => {
  if (dataset === 'wb') wbVisible.value = !wbVisible.value;
  else ozonVisible.value = !ozonVisible.value;
  if (chartInstance) {
    chartInstance.data.datasets[0].hidden = !wbVisible.value;
    chartInstance.data.datasets[1].hidden = !ozonVisible.value;
    chartInstance.update();
  }
};

onMounted(() => {
  if (!props.data.length) return;
  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: props.data.map(d => formatDate(d.date)),
      datasets: [
        {
          label: 'Wildberries',
          data: props.data.map(d => d.wb_orders),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          tension: 0.3,
          fill: true,
          hidden: false
        },
        {
          label: 'Ozon',
          data: props.data.map(d => d.ozon_orders),
          borderColor: '#ec4899',
          backgroundColor: 'rgba(236,72,153,0.05)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#ec4899',
          pointBorderColor: '#fff',
          tension: 0.3,
          fill: true,
          hidden: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', font: { size: 11 } } },
        y: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', font: { size: 11 }, stepSize: 1 }, beginAtZero: true }
      }
    }
  });
});

watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.data.labels = newData.map(d => formatDate(d.date));
    chartInstance.data.datasets[0].data = newData.map(d => d.wb_orders);
    chartInstance.data.datasets[1].data = newData.map(d => d.ozon_orders);
    chartInstance.update();
  }
}, { deep: true });
</script>

<style scoped>
.orders-chart {
  width: 100%;
  height: 320px;
}
</style>