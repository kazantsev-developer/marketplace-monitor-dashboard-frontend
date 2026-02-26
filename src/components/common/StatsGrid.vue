<template>
  <div class="stats-summary">
    <StatsCard v-for="(stat, index) in stats" :key="index" :label="stat.label" :value="stat.value" />
  </div>
</template>

<script setup>
import StatsCard from './StatsCard.vue'

defineProps({
  stats: { type: Array, required: true }
})
</script>

<style scoped>
.stats-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 1024px) {
  .stats-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }
}
</style>