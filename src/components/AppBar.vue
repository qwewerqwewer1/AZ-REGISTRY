<script setup>
defineProps({
  filteredCount: { type: Number, default: 0 },
  totalCount:    { type: Number, default: 0 },
})
</script>

<template>
  <header class="appbar">
    <span class="appbar__logo">IT Реестр</span>
    <span class="appbar__sep"></span>
    <span class="appbar__count">{{ filteredCount }} / {{ totalCount }}</span>
  </header>
</template>

<style scoped>
.appbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; gap: 16px;
  padding: 0 28px; height: 56px;
  background: rgba(20,24,38,0.9); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.appbar__logo {
  font-family: 'Unbounded', sans-serif; font-weight: 900;
  font-size: 1.1rem; letter-spacing: -1px;
  background: linear-gradient(135deg, var(--green) 0%, #a8ffcf 60%, var(--accent) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.appbar__sep { flex: 1; }
.appbar__count { font-size: 0.7rem; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
</style>
