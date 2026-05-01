<script setup>
import UserCard from './UserCard.vue'

defineProps({
  groups:   { type: Array,  required: true },
  copiedIp: { type: String, default: '' },
  macDrop:  { type: Object, default: null },
})
defineEmits(['edit', 'delete', 'copy-ip', 'open-mac-drop'])
</script>

<template>
  <div>
    <div
      v-for="g in groups" :key="g.dept"
      class="dept-group"
      :style="{ '--dept-color': g.color }"
    >
      <div class="dept-group__header">
        <span class="dept-group__dot"></span>
        <span class="dept-group__name">{{ g.dept }}</span>
        <span class="dept-group__count">{{ g.users.length }}</span>
        <span class="dept-group__line"></span>
      </div>
      <div class="card-grid">
        <UserCard
          v-for="u in g.users" :key="u.id"
          :user="u"
          :copied-ip="copiedIp"
          :mac-drop="macDrop"
          @click="$emit('edit', u)"
          @delete="(e) => $emit('delete', e, u)"
          @copy-ip="(ip) => $emit('copy-ip', ip)"
          @open-mac-drop="(e, raw, id) => $emit('open-mac-drop', e, raw, id)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dept-group { margin-bottom: 32px; }
.dept-group__header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.dept-group__dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--dept-color, var(--green)); flex-shrink: 0;
  box-shadow: 0 0 8px var(--dept-color, var(--green));
}
.dept-group__name {
  font-family: 'Unbounded', sans-serif; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; color: var(--dept-color, var(--green));
}
.dept-group__count {
  font-size: 0.65rem; color: var(--muted); background: var(--card);
  border: 1px solid var(--border2); padding: 2px 8px; border-radius: 99px;
}
.dept-group__line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--dept-color, var(--green)) 0%, transparent 100%); opacity: 0.2;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
}
</style>
