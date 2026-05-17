<template>
  <div class="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
    <p class="text-gray-400 text-sm">{{ label }}</p>
    <p class="text-2xl font-bold text-white mt-1">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>