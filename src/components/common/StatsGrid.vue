<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatsCard v-for="(stat, index) in stats" :key="index" :label="stat.label" :value="stat.value" />
  </div>
</template>

<script setup lang="ts">
import StatsCard from './StatsCard.vue';

interface StatItem {
  label: string;
  value: string | number;
}

defineProps<{
  stats: StatItem[];
}>();
</script>