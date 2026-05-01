<script setup>
defineProps({
  sortKey:  { type: String,  required: true },
  sortDir:  { type: Number,  default: 1 },
  viewMode: { type: String,  default: 'grid' },
})
defineEmits(['sort', 'update:viewMode'])

const SORT_KEYS = ['ФИО пользователя', 'IP адрес', 'Департамент', 'Здание, кабинет']
</script>

<template>
  <div class="sort-bar">
    <span class="sort-bar__label">Сортировка</span>
    <button
      v-for="k in SORT_KEYS" :key="k"
      class="sort-btn"
      :class="{ 'sort-btn--active': sortKey === k }"
      @click="$emit('sort', k)"
    >
      {{ k }}{{ sortKey === k ? (sortDir === 1 ? ' ↑' : ' ↓') : '' }}
    </button>
    <span class="sort-bar__sep"></span>
    <div class="view-btns">
      <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'grid' }" title="Сетка" @click="$emit('update:viewMode', 'grid')">⊞</button>
      <button class="view-btn" :class="{ 'view-btn--active': viewMode === 'table' }" title="Таблица" @click="$emit('update:viewMode', 'table')">☰</button>
    </div>
  </div>
</template>

<style scoped>
.sort-bar {
  padding: 8px 28px; display: flex; gap: 6px; align-items: center;
  border-bottom: 1px solid var(--border2); flex-wrap: wrap;
}
.sort-bar__label { font-size: 0.6rem; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-right: 2px; }
.sort-btn {
  font-family: inherit; font-size: 0.67rem; padding: 3px 9px; border-radius: 6px;
  cursor: pointer; border: 1px solid var(--border2); background: transparent; color: var(--muted); transition: all 0.15s;
}
.sort-btn:hover { border-color: var(--green); color: var(--green); }
.sort-btn--active { border-color: var(--green); color: var(--green); background: var(--green-dim); }
.sort-bar__sep { flex: 1; }
.view-btns { display: flex; gap: 4px; }
.view-btn {
  font-size: 1rem; width: 30px; height: 28px; border-radius: 6px;
  border: 1px solid var(--border2); background: transparent; color: var(--muted);
  cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center;
}
.view-btn:hover { border-color: var(--green); color: var(--green); }
.view-btn--active { border-color: var(--green); color: var(--green); background: var(--green-dim); }
</style>
