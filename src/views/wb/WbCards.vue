<template>
  <div class="wb-cards">
    <div class="container">
      <PageHeader title="Карточки товаров Wildberries" subtitle="Список всех товаров" />

      <FilterBar>
        <SearchInput v-model="searchQuery" placeholder="Поиск по артикулу, названию или бренду..." />
      </FilterBar>

      <StatsGrid :stats="statsData" />

      <div class="cards-grid">
        <div v-for="card in paginatedCards" :key="card.nm_id" class="card-item">
          <div class="card-image">
            <img v-if="card.photos && card.photos[0]" :src="card.photos[0].big" :alt="card.title">
            <div v-else class="no-image">Нет фото</div>
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ card.title || 'Без названия' }}</h3>
            <div class="card-details">
              <span class="card-badge">nm: {{ card.nm_id }}</span>
              <span class="card-badge">Арт: {{ card.vendor_code }}</span>
              <span class="card-badge">{{ card.brand }}</span>
            </div>
            <div class="card-sizes" v-if="card.sizes && card.sizes.length">
              <span v-for="size in card.sizes.slice(0, 5)" :key="size.sku" class="size-tag">
                {{ size.tech_size || 'б/р' }}
              </span>
              <span v-if="card.sizes.length > 5" class="size-more">+{{ card.sizes.length - 5 }}</span>
            </div>
            <div class="card-footer">
              <span class="card-date">Обновлено: {{ formatDate(card.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="currentPage = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { wbApi } from '../../api/client'
import PageHeader from '../../components/common/PageHeader.vue'
import StatsGrid from '../../components/common/StatsGrid.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import SearchInput from '../../components/common/SearchInput.vue'
import Pagination from '../../components/common/Pagination.vue'

const cards = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 20

const statsData = computed(() => {
  const filtered = filteredCards.value
  const total = filtered.length
  const uniqueBrands = new Set(filtered.map(c => c.brand).filter(Boolean)).size
  const withPhotos = filtered.filter(c => c.photos && c.photos.length).length
  const updatedLastHour = filtered.filter(c => {
    if (!c.updated_at) return false
    const updated = new Date(c.updated_at)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return updated > hourAgo
  }).length
  return [
    { label: 'Всего карточек', value: formatNumber(total) },
    { label: 'Уникальных брендов', value: formatNumber(uniqueBrands) },
    { label: 'С фото', value: formatNumber(withPhotos) },
    { label: 'Обновлено за час', value: formatNumber(updatedLastHour) }
  ]
})

const filteredCards = computed(() => {
  if (!searchQuery.value) return cards.value
  const q = searchQuery.value.toLowerCase()
  return cards.value.filter(card => {
    return (card.vendor_code?.toLowerCase().includes(q)) ||
      (card.title?.toLowerCase().includes(q)) ||
      (card.brand?.toLowerCase().includes(q)) ||
      String(card.nm_id).includes(q)
  })
})

const totalPages = computed(() => Math.ceil(filteredCards.value.length / pageSize))
const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

const formatNumber = (num) => new Intl.NumberFormat('ru-RU').format(num || 0)
const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}

onMounted(async () => {
  try {
    const response = await wbApi.getCards({ limit: 1000 })
    cards.value = response.data.data
  } catch (err) {
    console.error('Ошибка загрузки:', err)
  }
})
</script>

<style scoped>
.wb-cards {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.card-item {
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  transition: all 0.2s;
  cursor: pointer;
}

.card-item:hover {
  border-color: #e052c4;
  border-width: 3px;
  transform: translateY(-2px);
}

.card-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: rgba(255, 255, 255, 0.3);
  font-size: 12px;
}

.card-info {
  flex: 1;
  padding: 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}

.card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.card-badge {
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.size-tag {
  background: rgba(224, 82, 196, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: #e052c4;
  border: 1px solid rgba(224, 82, 196, 0.2);
}

.size-more {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  padding: 2px 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }

  .card-item {
    flex-direction: column;
  }

  .card-image {
    width: 100%;
    height: 200px;
  }
}
</style>