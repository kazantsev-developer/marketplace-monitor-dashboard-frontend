<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/widgets/AppLayout/AppLayout.vue'
import { RouterView } from 'vue-router'
</script>