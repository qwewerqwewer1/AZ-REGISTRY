<script setup>
import { macFormats } from "../utils/mac.js";
import { isOn } from "../utils/misc.js";
import { SOFT_INDICATORS } from "../constants/index.js";

defineProps({
  rows: { type: Array, required: true },
  sortKey: { type: String, required: true },
  sortDir: { type: Number, default: 1 },
  copiedIp: { type: String, default: "" },
  macDrop: { type: Object, default: null },
});
defineEmits(["sort", "edit", "delete", "copy-ip", "open-mac-drop"]);

const SORT_COLS = {
  ФИО: "ФИО пользователя",
  Логин: "Логин пользователя",
  Отдел: "Департамент",
  Кабинет: "Здание, кабинет",
  IP: "IP адрес",
};

function thClass(key) {
  if (key !== "props.sortKey") return "";
}
function colClass(colKey, sortKey, sortDir) {
  if (SORT_COLS[colKey] !== sortKey) return "";
  return sortDir === 1 ? "sort-asc" : "sort-desc";
}
</script>

<template>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="(field, label) in SORT_COLS"
            :key="label"
            :class="
              field === sortKey
                ? sortDir === 1
                  ? 'sort-asc'
                  : 'sort-desc'
                : ''
            "
            @click="$emit('sort', field)"
          >
            {{ label }}
          </th>
          <th>IP</th>
          <th>MAC</th>
          <th>ПО</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in rows" :key="u.id" @click="$emit('edit', u)">
          <td class="td-name">{{ u["ФИО пользователя"] || "—" }}</td>
          <td class="td-muted">{{ u["Логин пользователя"] || "—" }}</td>
          <td class="td-muted">{{ u["Департамент"] || "—" }}</td>
          <td class="td-muted">{{ u["Здание, кабинет"] || "—" }}</td>
          <td>
            <span
              v-if="u['IP адрес']"
              class="chip chip--ip"
              style="font-size: 0.65rem"
              :class="{ copied: copiedIp === u['IP адрес'] }"
              @click.stop="$emit('copy-ip', u['IP адрес'])"
            >
              <span class="chip__icon">{{
                copiedIp === u["IP адрес"] ? "✓" : ""
              }}</span>
              {{ u["IP адрес"] }}
            </span>
            <span v-else class="td-muted">—</span>
          </td>
          <td>
            <span
              v-if="u['MAC адрес'] && macFormats(u['MAC адрес'])"
              class="chip chip--mac"
              style="font-size: 0.65rem"
              :class="{
                copied: macDrop && macDrop.copiedKey && macDrop.userId === u.id,
              }"
              @click.stop="$emit('open-mac-drop', $event, u['MAC адрес'], u.id)"
            >
              <span class="chip__icon">{{
                macDrop && macDrop.copiedKey && macDrop.userId === u.id
                  ? "✓"
                  : ""
              }}</span>
              MAC ▾
            </span>
            <span v-else class="td-muted">—</span>
          </td>
          <td>
            <div style="display: flex; gap: 3px; flex-wrap: wrap">
              <span
                v-for="s in SOFT_INDICATORS"
                :key="s"
                v-if="isOn(u[s])"
                class="soft-pill"
                >{{ s }}</span
              >
            </div>
          </td>
          <td style="text-align: right">
            <button
              class="btn--icon"
              style="
                width: 26px;
                height: 26px;
                font-size: 0.75rem;
                opacity: 0.35;
              "
              @click.stop="$emit('delete', $event, u)"
            >
              🗑
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  border-radius: var(--radius);
  border: 1px solid var(--border2);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}
.data-table th {
  background: var(--card2);
  color: var(--muted);
  font-size: 0.6rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 10px 14px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid var(--border2);
  cursor: pointer;
  user-select: none;
  transition: color 0.15s;
}
.data-table th:hover {
  color: var(--green);
}
.data-table th.sort-asc::after {
  content: " ↑";
  color: var(--green);
}
.data-table th.sort-desc::after {
  content: " ↓";
  color: var(--green);
}
.data-table td {
  padding: 9px 14px;
  border-bottom: 1px solid var(--border2);
  vertical-align: middle;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
  cursor: pointer;
}
.td-name {
  font-weight: 700;
  white-space: nowrap;
}
.td-muted {
  color: var(--muted);
  white-space: nowrap;
  font-size: 0.75rem;
}
</style>
