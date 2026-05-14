<template>
  <div class="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
    <p class="text-gray-400 text-sm">{{ label }}</p>
    <p class="text-2xl font-bold text-white mt-1">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number]
});
</script>