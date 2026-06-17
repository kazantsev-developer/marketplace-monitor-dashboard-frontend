<template>
  <Dropdown :model-value="modelValue" @update:model-value="(val: string | number) => emit('update:modelValue', val)"
    :options="options" option-label="label" option-value="value" :placeholder="placeholder" class="w-full sm:w-64"
    data-testid="select-filter" />
</template>

<script setup lang="ts">
import Dropdown from 'primevue/dropdown'
import type { SelectOption } from './types'

defineProps<{
  modelValue?: string | number
  options: SelectOption[]
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()
</script>