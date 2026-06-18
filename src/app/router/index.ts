import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/pages/dashboard/DashboardPage.vue"),
    },
    {
      path: "/ozon/orders",
      name: "ozon-orders",
      component: () => import("@/pages/ozon-orders/OzonOrdersPage.vue"),
    },
    {
      path: "/ozon/remains",
      name: "ozon-remains",
      component: () => import("@/pages/ozon-remains/OzonRemainsPage.vue"),
    },
    {
      path: "/wb/orders",
      name: "wb-orders",
      component: () => import("@/pages/wb-orders/WbOrdersPage.vue"),
    },
    {
      path: "/wb/remains",
      name: "wb-remains",
      component: () => import("@/pages/wb-remains/WbRemainsPage.vue"),
    },
    {
      path: "/wb/cards",
      name: "wb-cards",
      component: () => import("@/pages/wb-cards/WbCardsPage.vue"),
    },
    {
      path: "/moysklad/stocks",
      name: "moysklad-stocks",
      component: () => import("@/pages/moysklad-stocks/MoyskladStocksPage.vue"),
    },
    {
      path: "/system/logs",
      name: "system-logs",
      component: () => import("@/pages/sync-logs/SyncLogsPage.vue"),
    },
  ],
});

export default router;
