<script setup>
defineProps({
  message: { type: String, default: '' },
})
</script>

<template>
  <div v-if="message" class="toast">{{ message }}</div>
</template>

<style scoped>
.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: var(--card2); border: 1px solid var(--green); color: var(--green);
  border-radius: 99px; padding: 9px 22px; font-size: 0.75rem; letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(66,184,131,0.2); z-index: 9999; pointer-events: none;
  animation: toastIn 0.2s ease;
}
</style>
