<template>
  <div class="stats-card">
    <p class="text-sm text-gray-400">{{ label }}</p>
    <p class="text-2xl font-bold mt-1">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>