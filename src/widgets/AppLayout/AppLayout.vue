<template>
  <div class="flex h-screen bg-gray-950">
    <aside class="w-44 border-r border-gray-800 bg-gray-900 flex flex-col">
      <div class="p-4 border-b border-gray-800 flex items-center gap-3">
        <div class="leading-tight">
          <h2 class="text-lg font-bold text-white">MP Monitor</h2>
        </div>
        <ThemeSwitch class="ml-auto" />
      </div><template>
  <div class="flex h-screen bg-gray-950">
    <aside class="w-44 border-r border-gray-800 bg-gray-900 flex flex-col">
      <div class="p-4 border-b border-gray-800 flex items-center gap-3">
        <div class="leading-tight">
          <h2 class="text-lg font-bold text-white">MP Monitor</h2>
        </div>
        <ThemeSwitch class="ml-auto" />
      </div>

      <nav class="flex-1 p-4 space-y-6">
        <div v-for="section in navSections" :key="section.title">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            {{ section.title }}
          </div>
          <div class="space-y-1">
            <router-link v-for="link in section.links" :key="link.to" :to="link.to"
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors" :class="isActive(link.to)
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
              <i :class="link.icon" class="w-5 h-5" />
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

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

const route = useRoute()

const isActive = (path: string): boolean => route.path === path

interface NavLink {
  label: string
  to: string
  icon: string
}

interface NavSection {
  title: string
  links: NavLink[]
}

// Navigation sections ordered Ozon -> Wildberries -> MoySklad -> System
const navSections: NavSection[] = [
  {
    title: 'Дашборд',
    links: [{ label: 'Главная', to: '/', icon: 'pi pi-home' }],
  },
  {
    title: 'Ozon',
    links: [
      { label: 'Заказы', to: '/ozon/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/ozon/remains', icon: 'pi pi-box' },
    ],
  },
  {
    title: 'Wildberries',
    links: [
      { label: 'Заказы', to: '/wb/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/wb/remains', icon: 'pi pi-box' },
      { label: 'Карточки', to: '/wb/cards', icon: 'pi pi-id-card' },
    ],
  },
  {
    title: 'МойСклад',
    links: [{ label: 'Склад', to: '/moysklad/stocks', icon: 'pi pi-box' }],
  },
  {
    title: 'Система',
    links: [{ label: 'Логи', to: '/system/logs', icon: 'pi pi-history' }],
  },
]
</script>

      <nav class="flex-1 p-4 space-y-6">
        <div v-for="section in navSections" :key="section.title">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
            {{ section.title }}
          </div>
          <div class="space-y-1">
            <router-link v-for="link in section.links" :key="link.to" :to="link.to"
              class="flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors" :class="isActive(link.to)
                ? 'bg-gray-800 text-white font-medium'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
              <i :class="link.icon" class="w-5 h-5" />
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

<script setup lang="ts">
import { useRoute } from 'vue-router'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

const route = useRoute()

const isActive = (path: string): boolean => route.path === path

interface NavLink {
  label: string
  to: string
  icon: string
}

interface NavSection {
  title: string
  links: NavLink[]
}

// Navigation sections ordered Ozon -> Wildberries -> MoySklad -> System
const navSections: NavSection[] = [
  {
    title: 'Дашборд',
    links: [{ label: 'Главная', to: '/', icon: 'pi pi-home' }],
  },
  {
    title: 'Ozon',
    links: [
      { label: 'Заказы', to: '/ozon/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/ozon/remains', icon: 'pi pi-box' },
    ],
  },
  {
    title: 'Wildberries',
    links: [
      { label: 'Заказы', to: '/wb/orders', icon: 'pi pi-shopping-cart' },
      { label: 'Остатки', to: '/wb/remains', icon: 'pi pi-box' },
      { label: 'Карточки', to: '/wb/cards', icon: 'pi pi-id-card' },
    ],
  },
  {
    title: 'МойСклад',
    links: [{ label: 'Склад', to: '/moysklad/stocks', icon: 'pi pi-box' }],
  },
  {
    title: 'Система',
    links: [{ label: 'Логи', to: '/system/logs', icon: 'pi pi-history' }],
  },
]
</script>