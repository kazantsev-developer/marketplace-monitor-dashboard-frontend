<template>
  <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" class="filter-select">
    <slot></slot>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.filter-select {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  font-size: 14px;
  min-width: 150px;
  text-align: center;
  text-align-last: center;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #e052c4;
}

.filter-select:hover {
  background: #e052c4;
  color: #fff;
  border-color: #e052c4;
}

.filter-select option {
  text-align: center;
  background: #0f0f0f;
  color: #fff;
}

.filter-select:hover option {
  background: #0f0f0f;
  color: #fff;
}
</style>