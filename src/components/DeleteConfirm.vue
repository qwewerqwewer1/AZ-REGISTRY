<script setup>
defineProps({
  user: { type: Object, default: null },
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="user" class="confirm-overlay" @click.self="$emit('cancel')">
    <div class="confirm-box">
      <div class="confirm-box__icon">🗑</div>
      <div class="confirm-box__title">Удалить запись?</div>
      <div class="confirm-box__text">
        {{ user['ФИО пользователя'] || 'Без имени' }}<br>
        <span style="opacity:0.6">Это действие нельзя отменить</span>
      </div>
      <div class="confirm-box__actions">
        <button class="btn btn--ghost" @click="$emit('cancel')">Отмена</button>
        <button class="btn btn--danger" @click="$emit('confirm')">Удалить</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-overlay {
  position: fixed; inset: 0; z-index: 300; background: rgba(10,13,24,0.8);
  backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.15s ease;
}
.confirm-box {
  background: var(--card); border: 1px solid rgba(224,85,85,0.35); border-radius: 14px;
  padding: 28px 32px; max-width: 360px; width: 100%; text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5); animation: slideUp 0.18s ease;
}
.confirm-box__icon { font-size: 2rem; margin-bottom: 12px; }
.confirm-box__title { font-family: 'Unbounded', sans-serif; font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; }
.confirm-box__text { font-size: 0.75rem; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
.confirm-box__actions { display: flex; gap: 10px; justify-content: center; }
</style>
