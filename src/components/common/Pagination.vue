<template>
  <div class="pagination" v-if="totalPages > 1">
    <button @click="$emit('page-change', currentPage - 1)" :disabled="currentPage === 1"
      class="pagination-btn">←</button>
    <span class="pagination-info">Страница {{ currentPage }} из {{ totalPages }}</span>
    <button @click="$emit('page-change', currentPage + 1)" :disabled="currentPage === totalPages"
      class="pagination-btn">→</button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})
defineEmits(['page-change'])
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.pagination-btn {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #e052c4;
  background: #e052c4;
  color: #fff;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-info {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
</style>