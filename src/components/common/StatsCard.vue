<template>
  <div class="stat-summary-card">
    <span class="stat-label">{{ label }}</span>
    <span class="stat-value">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true }
})
</script>

<style scoped>
.stat-summary-card {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  width: 100%;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  width: 100%;
}
</style>