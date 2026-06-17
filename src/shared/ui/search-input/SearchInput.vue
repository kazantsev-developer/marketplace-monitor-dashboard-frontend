<template>
  <InputText :model-value="modelValue"
    @update:model-value="(val: string | undefined) => val !== undefined && emit('update:modelValue', val)"
    :placeholder="placeholder" class="w-full sm:w-64 h-10 px-4 py-2" data-testid="search-input" />
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'

defineProps<{
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>