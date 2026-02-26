<template>
  <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder" class="search-input">
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Поиск...' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-input {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  color: #fff;
  font-size: 14px;
  width: 100%;
  cursor: pointer;
}

.search-input:focus {
  outline: none;
  border-color: #e052c4;
  background: #e052c4;
  color: #fff;
}

.search-input:focus::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:hover {
  border-color: #e052c4;
  background: #e052c4;
  color: #fff;
}

.search-input:hover::placeholder {
  color: rgba(255, 255, 255, 0.7);
}
</style>