<template>
  <Dropdown :model-value="modelValue" @update:model-value="onChange" :options="options" option-label="label"
    option-value="value" :placeholder="placeholder" class="w-full sm:w-64" />
</template>

<script setup lang="ts">
import Dropdown from 'primevue/dropdown';

export interface SelectOption {
  value: string | number;
  label: string;
}

defineProps<{
  modelValue?: string | number;
  options: SelectOption[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const onChange = (value: string | number) => {
  emit('update:modelValue', value);
};
</script>