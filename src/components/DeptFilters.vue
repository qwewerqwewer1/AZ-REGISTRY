<script setup>
defineProps({
  depts:      { type: Array,  required: true },
  modelValue: { type: String, default: null },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="dept-filters">
    <span class="dept-filters__label">Отдел</span>
    <button
      class="dept-chip"
      :class="{ 'dept-chip--active': !modelValue }"
      style="--dept-color: var(--green)"
      @click="$emit('update:modelValue', null)"
    >
      <span class="dept-chip__dot"></span>Все
    </button>
    <button
      v-for="d in depts" :key="d.name"
      class="dept-chip"
      :class="{ 'dept-chip--active': modelValue === d.name }"
      :style="{ '--dept-color': d.color }"
      @click="$emit('update:modelValue', modelValue === d.name ? null : d.name)"
    >
      <span class="dept-chip__dot"></span>{{ d.name }}
    </button>
  </div>
</template>

<style scoped>
.dept-filters {
  padding: 10px 28px; display: flex; gap: 7px; flex-wrap: wrap; align-items: center;
  border-bottom: 1px solid var(--border2); background: var(--navy);
}
.dept-filters__label {
  font-size: 0.62rem; color: var(--muted); letter-spacing: 1.5px;
  text-transform: uppercase; margin-right: 2px; flex-shrink: 0;
}
.dept-chip {
  display: inline-flex; align-items: center; gap: 5px; font-size: 0.65rem;
  padding: 3px 10px; border-radius: 99px; cursor: pointer;
  border: 1px solid var(--border2); background: var(--card); color: var(--muted);
  font-family: inherit; transition: all 0.15s;
}
.dept-chip:hover { border-color: var(--dept-color, var(--green)); color: var(--text); }
.dept-chip--active { background: var(--card2); border-color: var(--dept-color, var(--green)); color: var(--text); }
.dept-chip__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--dept-color, var(--green)); flex-shrink: 0;
}
</style>
