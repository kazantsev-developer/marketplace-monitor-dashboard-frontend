<template>
  <div class="header-section">
    <h1 class="page-title">{{ title }}</h1>
    <p class="page-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true }
})
</script>

<style scoped>
.header-section {
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.page-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
</style>