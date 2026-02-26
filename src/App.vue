<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>

<script setup>
import AppLayout from './components/layout/AppLayout.vue'
import { RouterView } from 'vue-router'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  line-height: 1.5;
}

#app {
  min-height: 100vh;
}
</style>