<template>
  <DataTable :value="data" class="custom-table p-datatable-sm rounded-xl overflow-hidden border border-gray-200">
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

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  emptyText: { type: String, default: 'Нет данных' }
});
</script>