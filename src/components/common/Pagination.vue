<template>
  <div v-if="totalPages > 1" class="flex justify-center mt-6">
    <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange"
      template="PrevPageLink PageLinks NextPageLink" />
  </div>
</template>

<script setup lang="ts">
import Paginator from 'primevue/paginator';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    pageSize?: number;
  }>(),
  { pageSize: 20 },
);

const emit = defineEmits<{
  (e: 'page-change', page: number): void;
}>();

const totalRecords = computed(() => props.totalPages * props.pageSize);

const onPageChange = (event: { page: number }) => {
  emit('page-change', event.page + 1);
};
</script>