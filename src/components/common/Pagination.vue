<template>
  <div v-if="totalPages > 1" class="flex justify-center mt-6">
    <Paginator :rows="pageSize" :totalRecords="totalRecords" @page="onPageChange"
      template="PrevPageLink PageLinks NextPageLink" />
  </div>
</template>

<script setup>
import Paginator from 'primevue/paginator';
import { computed } from 'vue';

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  pageSize: { type: Number, default: 20 }
});

const emit = defineEmits(['page-change']);
const totalRecords = computed(() => props.totalPages * props.pageSize);

const onPageChange = (event) => {
  const newPage = event.page + 1;
  emit('page-change', newPage);
};
</script>