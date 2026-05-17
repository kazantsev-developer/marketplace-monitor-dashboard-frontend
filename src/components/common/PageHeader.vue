<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-white mb-1">{{ title }}</h1>
    <p class="text-gray-400 text-sm">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle: string;
}>();
</script>