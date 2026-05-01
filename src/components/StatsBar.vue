<script setup>
defineProps({
  stats: { type: Object, required: true },
})
</script>

<template>
  <div class="stats-bar">
    <div class="stat">
      <span class="stat__val">{{ stats.total }}</span>
      <span class="stat__label">Записей</span>
    </div>
    <div class="stat">
      <span class="stat__val">{{ stats.depts }}</span>
      <span class="stat__label">Отделов</span>
    </div>
    <div class="stat">
      <span class="stat__val" :class="{ 'stat__val--warn': stats.noIp > 0 }">{{ stats.noIp }}</span>
      <span class="stat__label">Без IP</span>
    </div>
    <div class="stat">
      <span class="stat__val" :class="{ 'stat__val--warn': stats.noMac > 0 }">{{ stats.noMac }}</span>
      <span class="stat__label">Без MAC</span>
    </div>
  </div>
</template>

<style scoped>
.stats-bar {
  display: flex; background: var(--navy2);
  border-bottom: 1px solid var(--border2);
  overflow-x: auto; scrollbar-width: none;
}
.stats-bar::-webkit-scrollbar { display: none; }
.stat {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 10px 28px; border-right: 1px solid var(--border2); flex-shrink: 0;
}
.stat__val {
  font-family: 'Unbounded', sans-serif; font-size: 1.15rem; font-weight: 700; line-height: 1;
}
.stat__val--warn { color: var(--accent); }
.stat__label { font-size: 0.58rem; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }
</style>
