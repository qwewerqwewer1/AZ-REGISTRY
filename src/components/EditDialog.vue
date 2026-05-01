<script setup>
import { ref, computed, watch } from 'vue'
import { isOn } from '../utils/misc.js'

const props = defineProps({
  user:          { type: Object, default: null },
  tabGroups:     { type: Array,  required: true },
  checkboxFields:{ type: Array,  required: true },
})
const emit = defineEmits(['close', 'delete'])

const activeTab = ref(0)
const cbSet = computed(() => new Set(props.checkboxFields))

watch(() => props.user, () => { activeTab.value = 0 })

function toggle(field) {
  props.user[field] = isOn(props.user[field]) ? '' : '+'
}
</script>

<template>
  <div v-if="user" class="overlay" @click.self="$emit('close')">
    <div class="dialog">
      <div class="dialog__head">
        <span class="dialog__title">Карточка записи</span>
        <button class="btn--icon" style="width:32px;height:32px;font-size:1.2rem" @click="$emit('close')">×</button>
      </div>

      <div class="tabs">
        <button
          v-for="(tab, i) in tabGroups" :key="tab.id"
          class="tab" :class="{ 'tab--active': activeTab === i }"
          @click="activeTab = i"
        >{{ tab.label }}</button>
      </div>

      <div class="dialog__body">
        <div v-for="(tab, i) in tabGroups" :key="tab.id" v-show="activeTab === i">
          <!-- Чекбоксы -->
          <div v-if="tab.fields.some(f => cbSet.has(f))" class="soft-checks">
            <div
              v-for="f in tab.fields.filter(f => cbSet.has(f))" :key="f"
              class="soft-check" :class="{ 'soft-check--on': isOn(user[f]) }"
              @click="toggle(f)"
            >
              <span class="soft-check__box">{{ isOn(user[f]) ? '✓' : '' }}</span>
              <span class="soft-check__label">{{ f }}</span>
            </div>
          </div>
          <!-- Текстовые поля -->
          <div class="form-grid">
            <div v-for="f in tab.fields.filter(f => !cbSet.has(f))" :key="f" class="form-field">
              <label class="form-label">{{ f }}</label>
              <input v-model="user[f]" class="form-input" type="text" />
            </div>
          </div>
        </div>
      </div>

      <div class="dialog__actions">
        <button class="btn btn--danger" style="margin-right:auto" @click="$emit('delete', user)">🗑 Удалить</button>
        <button class="btn btn--ghost" @click="$emit('close')">Отмена</button>
        <button class="btn btn--primary" @click="$emit('close')">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; z-index: 200; background: rgba(10,13,24,0.75);
  backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
  padding: 20px; animation: fadeIn 0.15s ease;
}
.dialog {
  background: var(--card); border: 1px solid var(--border); border-radius: 18px;
  width: 100%; max-width: 640px; height: 520px; max-height: 90vh;
  display: flex; flex-direction: column; box-shadow: var(--shadow);
  animation: slideUp 0.18s ease;
}
.dialog__head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px 0; }
.dialog__title { font-family: 'Unbounded', sans-serif; font-size: 0.9rem; font-weight: 700; }
.tabs { display: flex; padding: 12px 24px 0; border-bottom: 1px solid var(--border2); }
.tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  font-family: inherit; font-size: 0.73rem; color: var(--muted); cursor: pointer;
  padding: 8px 14px; margin-bottom: -1px; transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--text); }
.tab--active { color: var(--green); border-bottom-color: var(--green); }
.dialog__body { flex: 1; overflow-y: auto; padding: 18px 24px; scrollbar-width: thin; scrollbar-color: var(--border2) transparent; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 18px; }
.form-field { display: flex; flex-direction: column; gap: 4px; }
.form-label { font-size: 0.62rem; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
.form-input {
  background: var(--navy2); border: 1px solid var(--border2); border-radius: var(--radius-sm);
  color: var(--text); font-family: inherit; font-size: 0.8rem; padding: 7px 10px;
  outline: none; transition: border-color 0.15s;
}
.form-input:focus { border-color: var(--green); }
.dialog__actions { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 24px; border-top: 1px solid var(--border2); }

.soft-checks { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0 14px; }
.soft-check {
  display: flex; align-items: center; gap: 7px; cursor: pointer; padding: 5px 10px;
  border-radius: 7px; border: 1px solid var(--border2); background: var(--navy2);
  transition: border-color 0.15s, background 0.15s; user-select: none;
}
.soft-check:hover { border-color: var(--border); background: var(--card2); }
.soft-check--on { border-color: var(--green); background: var(--green-dim); }
.soft-check__box {
  width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid var(--muted);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.6rem; color: transparent; transition: all 0.15s; flex-shrink: 0;
}
.soft-check--on .soft-check__box { background: var(--green); border-color: var(--green); color: #0d1a12; }
.soft-check__label { font-size: 0.72rem; color: var(--muted); }
.soft-check--on .soft-check__label { color: var(--text); }
</style>
