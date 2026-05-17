<template>
  <DataTable :value="data" class="p-datatable-sm" tableStyle="min-width: 50rem">
    <Column v-for="col in columns" :key="col.key" :field="col.key" :header="col.label"
      :class="col.align === 'right' ? 'text-right' : 'text-left'">
      <template #body="{ data }">
        <slot :name="col.key" :item="data">
          {{ data[col.key] }}
        </slot>
      </template>
    </Column>
    <template #empty>
      <div class="text-center py-8 text-gray-400">{{ emptyText }}</div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export interface ColumnDef {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

withDefaults(
  defineProps<{
    columns: ColumnDef[];
    data: Record<string, unknown>[];
    emptyText?: string;
  }>(),
  { emptyText: 'Нет данных' },
);
</script>