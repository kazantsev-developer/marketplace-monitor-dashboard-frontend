<template>
  <Dropdown :modelValue="modelValue" @update:modelValue="emitValue" :options="options" optionLabel="label"
    optionValue="value" :placeholder="placeholder" class="select-filter w-full sm:w-64" />
</template>

<script setup>
import Dropdown from 'primevue/dropdown';

defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Выберите' }
});

const emit = defineEmits(['update:modelValue']);
const emitValue = (val) => emit('update:modelValue', val);
</script>