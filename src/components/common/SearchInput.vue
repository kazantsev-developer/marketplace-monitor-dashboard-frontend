<template>
  <InputText :model-value="modelValue" @update:model-value="onInput" :placeholder="placeholder"
    class="w-full sm:w-64 h-10 px-4 py-2" />
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';

defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (value: string | undefined) => {
  if (value !== undefined) {
    emit('update:modelValue', value);
  }
};
</script>