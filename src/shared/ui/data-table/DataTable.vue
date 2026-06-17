<template>
  <DataTable :value="data" class="p-datatable-sm" tableStyle="min-width: 50rem" data-testid="data-table">
    <Column v-for="col in columns" :key="String(col.key)" :field="String(col.key)" :header="col.label"
      :class="col.align === 'right' ? 'text-right' : 'text-left'">
      <template #body="{ data: rowData }">
        <slot :name="String(col.key)" :item="rowData">
          {{ rowData[col.key] }}
        </slot>
      </template>
    </Column>
    <template #empty>
      <div class="text-center py-8 text-gray-400" data-testid="data-table-empty">
        {{ emptyText }}
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { ColumnDef } from './types'

defineProps<{
  columns: ColumnDef<T>[]
  data: T[]
  emptyText?: string
}>()
</script>