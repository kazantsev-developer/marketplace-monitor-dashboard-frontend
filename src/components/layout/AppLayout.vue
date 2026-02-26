<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">
        <h2>WB MONITOR</h2>
      </div>
      <nav class="nav">
        <div class="nav-section">
          <h3 class="nav-section-title">Дашборд</h3>
          <router-link to="/" class="nav-link" active-class="active">
            Главная
          </router-link>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Wildberries</h3>
          <router-link to="/wb/orders" class="nav-link" active-class="active">
            Заказы
          </router-link>
          <router-link to="/wb/remains" class="nav-link" active-class="active">
            Остатки
          </router-link>
          <router-link to="/wb/cards" class="nav-link" active-class="active">
            Карточки
          </router-link>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Ozon</h3>
          <router-link to="/ozon/orders" class="nav-link" active-class="active">
            Заказы
          </router-link>
          <router-link to="/ozon/remains" class="nav-link" active-class="active">
            Остатки
          </router-link>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">МойСклад</h3>
          <router-link to="/moysklad/stocks" class="nav-link" active-class="active">
            Остатки
          </router-link>
        </div>

        <div class="nav-section">
          <h3 class="nav-section-title">Система</h3>
          <router-link to="/system/logs" class="nav-link" active-class="active">
            Логи синхронизации
          </router-link>
        </div>
      </nav>
    </aside>

    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
}

.sidebar {
  width: 260px;
  background: #0f0f0f;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  padding: 0 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.nav {
  padding: 20px;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
  padding-left: 12px;
}

.nav-link {
  display: block;
  padding: 10px 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  margin-bottom: 2px;
  cursor: pointer;
}

.nav-link:hover {
  background: #e052c4;
  color: #fff;
}

.nav-link.active {
  background: #e052c4;
  color: #fff;
  border-left: 3px solid #e052c4;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 30px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .main-content {
    margin-left: 0;
  }

  .app-layout {
    flex-direction: column;
  }
}
</style>