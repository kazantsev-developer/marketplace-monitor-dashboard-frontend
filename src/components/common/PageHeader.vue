<template>
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ title }}</h1>
    <p class="text-gray-500 text-sm">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps(['title', 'subtitle']);
</script>