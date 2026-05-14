<template>
  <InputText :value="modelValue" @update:modelValue="emitValue" :placeholder="placeholder"
    class="w-full sm:w-64 h-10" />
</template>

<script setup>
import InputText from 'primevue/inputtext';

defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Поиск...' }
});

const emit = defineEmits(['update:modelValue']);
const emitValue = (val) => emit('update:modelValue', val);
</script>