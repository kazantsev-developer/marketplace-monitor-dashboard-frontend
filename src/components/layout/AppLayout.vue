<template>
  <div class="flex h-screen bg-gray-50">
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div class="p-5 border-b border-gray-200 flex items-center gap-2">
        <i class="pi pi-chart-line text-gray-800 text-xl"></i>
        <h2 class="text-xl font-bold text-gray-800">WB MONITOR</h2>
      </div>
      <nav class="flex-1 p-4 space-y-6">
        <div v-for="section in navSections" :key="section.title">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">{{ section.title }}</div>
          <div class="space-y-1">
            <router-link v-for="link in section.links" :key="link.to" :to="link.to"
              class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors"
              :class="$route.path === link.to ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'">
              <i :class="link.icon" class="w-5 h-5"></i>
              <span>{{ link.label }}</span>
            </router-link>
          </div>
        </div>
      </nav>
    </aside>
    <main class="flex-1 overflow-auto p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const navSections = [
  {
    title: 'Дашборд',
    links: [{ label: 'Главная', to: '/', icon: 'pi pi-home' }]
  },
  {
    title: 'Wildberries',
    links: [
      { label: 'Заказы', to: '/wb/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/wb/remains', icon: 'pi pi-box' },
      { label: 'Карточки', to: '/wb/cards', icon: 'pi pi-id-card' }
    ]
  },
  {
    title: 'Ozon',
    links: [
      { label: 'Заказы', to: '/ozon/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/ozon/remains', icon: 'pi pi-box' }
    ]
  },
  {
    title: 'МойСклад',
    links: [{ label: 'Остатки', to: '/moysklad/stocks', icon: 'pi pi-box' }]
  },
  {
    title: 'Система',
    links: [{ label: 'Логи синхронизации', to: '/system/logs', icon: 'pi pi-history' }]
  }
];
</script>