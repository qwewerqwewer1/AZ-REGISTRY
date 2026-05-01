<script setup>
import { macFormats } from '../utils/mac.js'
import { isOn } from '../utils/misc.js'
import { SOFT_INDICATORS } from '../constants/index.js'

defineProps({
  user:      { type: Object,  required: true },
  copiedIp:  { type: String,  default: '' },
  macDrop:   { type: Object,  default: null },
})
defineEmits(['click', 'delete', 'copy-ip', 'open-mac-drop'])
</script>

<template>
  <article class="user-card" @click="$emit('click')">
    <div class="user-card__head">
      <div class="avatar">{{ (user['ФИО пользователя'] || '?')[0] }}</div>
      <div style="flex:1;min-width:0">
        <div class="user-card__name">{{ user['ФИО пользователя'] || '—' }}</div>
        <div class="user-card__login">{{ user['Логин пользователя'] || '—' }}</div>
      </div>
      <button
        class="btn--icon"
        style="width:26px;height:26px;font-size:0.8rem;opacity:0.35;flex-shrink:0"
        title="Удалить"
        @click.stop="$emit('delete', $event)"
      >🗑</button>
    </div>

    <div class="user-card__chips">
      <span
        v-if="user['IP адрес']"
        class="chip chip--ip"
        :class="{ copied: copiedIp === user['IP адрес'] }"
        @click.stop="$emit('copy-ip', user['IP адрес'])"
      >
        <span class="chip__icon">{{ copiedIp === user['IP адрес'] ? '✓' : '' }}</span>
        IP {{ user['IP адрес'] }}
      </span>

      <span
        v-if="user['MAC адрес'] && macFormats(user['MAC адрес'])"
        class="chip chip--mac"
        :class="{ copied: macDrop && macDrop.copiedKey && macDrop.userId === user.id }"
        @click.stop="$emit('open-mac-drop', $event, user['MAC адрес'], user.id)"
      >
        <span class="chip__icon">{{ macDrop && macDrop.copiedKey && macDrop.userId === user.id ? '✓' : '' }}</span>
        MAC ▾
      </span>

      <span v-if="user['Здание, кабинет']" class="chip chip--secondary">
        {{ user['Здание, кабинет'] }}
      </span>
    </div>

    <div class="user-card__soft" v-if="SOFT_INDICATORS.some(s => isOn(user[s]))">
      <span v-for="s in SOFT_INDICATORS" :key="s" v-if="isOn(user[s])" class="soft-pill">{{ s }}</span>
    </div>
  </article>
</template>

<style scoped>
.user-card {
  background: var(--card); border: 1px solid var(--border2);
  border-radius: var(--radius); padding: 14px; cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.user-card:hover { border-color: rgba(66,184,131,0.35); box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.user-card__head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.avatar {
  width: 36px; height: 36px; border-radius: 9px; background: var(--green-dim);
  border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;
  font-family: 'Unbounded', sans-serif; font-weight: 700; font-size: 0.85rem;
  color: var(--green); flex-shrink: 0;
}
.user-card__name  { font-size: 0.82rem; font-weight: 700; line-height: 1.3; }
.user-card__login { font-size: 0.68rem; color: var(--muted); margin-top: 1px; }
.user-card__chips { display: flex; flex-wrap: wrap; gap: 5px; }
.user-card__soft  { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 7px; }
</style>
