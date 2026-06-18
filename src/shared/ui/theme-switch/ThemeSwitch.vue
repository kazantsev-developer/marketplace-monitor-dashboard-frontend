<template>
  <div class="theme-switch" data-testid="theme-switch" @click="theme.toggle()">
    <i :class="theme.isDark ? 'pi pi-moon' : 'pi pi-sun'" class="text-xl cursor-pointer" />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/shared/stores/theme'

const theme = useThemeStore()
</script>

<style scoped>
.theme-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>