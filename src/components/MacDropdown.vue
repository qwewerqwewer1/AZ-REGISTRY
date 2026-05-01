<script setup>
defineProps({
  macDrop: { type: Object, default: null },
})
defineEmits(['copy-fmt'])
</script>

<template>
  <div
    v-if="macDrop"
    class="mac-drop"
    :class="{ 'mac-drop--visible': macDrop.visible }"
    :style="{ top: macDrop.top + 'px', left: macDrop.left + 'px' }"
    @click.stop
  >
    <div
      v-for="(key, i) in ['colon', 'hyphen', 'cisco']" :key="key"
      class="mac-drop__row"
      :class="{ 'mac-drop__row--copied': macDrop.copiedKey === key }"
      @click="$emit('copy-fmt', $event, key)"
    >
      <span class="mac-drop__label">{{ ['COLON', 'HYPHEN', 'CISCO'][i] }}</span>
      <span class="mac-drop__val">{{ macDrop.formats[key] }}</span>
      <span class="mac-drop__check">{{ macDrop.copiedKey === key ? '✓' : '' }}</span>
    </div>
  </div>
</template>

<style scoped>
.mac-drop {
  position: fixed; z-index: 999; background: var(--card2);
  border: 1px solid rgba(240,192,96,0.35); border-radius: 10px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.55); min-width: 240px;
  opacity: 0; pointer-events: none; transform: translateY(-4px);
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.mac-drop--visible { opacity: 1; pointer-events: auto; transform: translateY(0); }
.mac-drop__row {
  display: flex; align-items: center; gap: 10px; padding: 9px 14px;
  cursor: pointer; transition: background 0.12s; border-bottom: 1px solid var(--border2);
}
.mac-drop__row:last-child { border-bottom: none; }
.mac-drop__row:hover { background: rgba(240,192,96,0.08); }
.mac-drop__row--copied { background: rgba(240,192,96,0.12); }
.mac-drop__label { font-size: 0.62rem; color: var(--muted); letter-spacing: 1.5px; min-width: 52px; }
.mac-drop__val   { font-size: 0.78rem; color: var(--accent); flex: 1; }
.mac-drop__check { color: var(--green); font-size: 0.8rem; width: 16px; text-align: right; }
</style>
