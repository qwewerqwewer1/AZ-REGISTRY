<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  hasData:     { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'load-excel', 'export-excel', 'add-user'])

const fileInput = ref(null)
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <span class="toolbar__search-icon">⌕</span>
      <input
        class="input"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        placeholder="ФИО, логину, Ip, MAC, "
      />
    </div>
    <input type="file" ref="fileInput" @change="emit('load-excel', $event)" accept=".xlsx,.xls" style="display:none" />
    <button class="btn btn--outline" @click="fileInput.click()">↑ Excel</button>
    <button
      class="btn btn--outline"
      :disabled="!hasData"
      style="color:var(--accent);border-color:rgba(240,192,96,0.3)"
      @click="emit('export-excel')"
    >↓ Экспорт</button>
    <button class="btn btn--primary" @click="emit('add-user')">+ Добавить</button>
  </div>
</template>

<style scoped>
.toolbar {
  padding: 12px 28px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
  border-bottom: 1px solid var(--border2); background: var(--navy2);
}
.toolbar__search { flex: 1; min-width: 220px; position: relative; }
.toolbar__search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--muted); pointer-events: none;
}
</style>
