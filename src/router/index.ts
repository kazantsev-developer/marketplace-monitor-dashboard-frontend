import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/Dashboard.vue';
import WbOrders from '../views/wb/WbOrders.vue';
import WbRemains from '../views/wb/WbRemains.vue';
import WbCards from '../views/wb/WbCards.vue';
import OzonOrders from '../views/ozon/OzonOrders.vue';
import OzonRemains from '../views/ozon/OzonRemains.vue';
import MoyskladStocks from '../views/moysklad/MoyskladStocks.vue';
import SyncLogs from '../views/system/SyncLogs.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/wb/orders',
      name: 'wb-orders',
      component: WbOrders,
    },
    {
      path: '/wb/remains',
      name: 'wb-remains',
      component: WbRemains,
    },
    {
      path: '/wb/cards',
      name: 'wb-cards',
      component: WbCards,
    },
    {
      path: '/ozon/orders',
      name: 'ozon-orders',
      component: OzonOrders,
    },
    {
      path: '/ozon/remains',
      name: 'ozon-remains',
      component: OzonRemains,
    },
    {
      path: '/moysklad/stocks',
      name: 'moysklad-stocks',
      component: MoyskladStocks,
    },
    {
      path: '/system/logs',
      name: 'system-logs',
      component: SyncLogs,
    },
  ],
});

export default router;
