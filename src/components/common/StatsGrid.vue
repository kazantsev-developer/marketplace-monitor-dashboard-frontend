<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <StatsCard v-for="(stat, idx) in stats" :key="idx" :label="stat.label" :value="stat.value" />
  </div>
</template>

<script setup>
import StatsCard from './StatsCard.vue';
defineProps({ stats: Array });
</script>