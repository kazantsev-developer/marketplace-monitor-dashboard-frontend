<template>
  <div class="filters-bar">
    <slot></slot>
  </div>
</template>

<style scoped>
.filters-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filters-bar * {
  cursor: pointer;
}

.filters-bar *:hover {
  background: #e052c4;
  color: #fff;
  border-color: #e052c4;
}
</style>