<script setup>
import { ref, computed } from "vue";

import AppBar from "./components/AppBar.vue";
import StatsBar from "./components/StatsBar.vue";
import Toolbar from "./components/Toolbar.vue";
import DeptFilters from "./components/DeptFilters.vue";
import SortBar from "./components/SortBar.vue";
import CardGrid from "./components/CardGrid.vue";
import TableView from "./components/TableView.vue";
import EditDialog from "./components/EditDialog.vue";
import DeleteConfirm from "./components/DeleteConfirm.vue";
import MacDropdown from "./components/MacDropdown.vue";
import ToastNotification from "./components/ToastNotification.vue";

import {
  FIELDS,
  CHECKBOX_FIELDS,
  TAB_GROUPS,
  DEPT_PALETTE,
  UNASSIGNED,
} from "./constants/index.js";
import { hashStr, isOn, copyText } from "./utils/misc.js";
import { normalizeMac } from "./utils/mac.js";
import { parseExcel, exportExcel } from "./utils/excel.js";
import { useToast } from "./composables/useToast.js";
import { useMacDrop } from "./composables/useMacDrop.js";
import {
  loadFromStorage,
  watchAndSave,
} from "./composables/useLocalStorage.js";

// ── State ──
const data = ref([]);
const idCounter = ref(1);
const query = ref("");
const editedUser = ref(null);
const deleteConfirm = ref(null);
const copiedIp = ref("");
const activeDept = ref(null);
const viewMode = ref("grid");
const sortKey = ref("ФИО пользователя");
const sortDir = ref(1);
let ipTimer = null;

// ── Composables ──
const { toast, showToast } = useToast();
const { macDrop, openMacDrop, copyMacFmt } = useMacDrop(showToast);

// ── LocalStorage ──
const saved = loadFromStorage();
if (saved) {
  data.value = saved.data;
  idCounter.value = saved.idCounter;
}
watchAndSave(data, idCounter);

// ── Computed ──
const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  const qm = normalizeMac(q);
  let list = data.value;

  if (q)
    list = list.filter((u) => {
      const txt = [
        "ФИО пользователя",
        "Логин пользователя",
        "IP адрес",
        "Доменное имя",
        "Локация",
      ].some((k) => (u[k] || "").toLowerCase().includes(q));
      const mac = normalizeMac(u["MAC адрес"]).includes(qm) && qm.length >= 2;
      return txt || mac;
    });

  if (activeDept.value) {
    list = list.filter(
      (u) =>
        ((u["Департамент"] || "").trim() || UNASSIGNED) === activeDept.value,
    );
  }

  return [...list].sort((a, b) => {
    const av = (a[sortKey.value] || "").toLowerCase();
    const bv = (b[sortKey.value] || "").toLowerCase();
    return av < bv ? -sortDir.value : av > bv ? sortDir.value : 0;
  });
});

const allDepts = computed(() => {
  const map = new Map();
  data.value.forEach((u) => {
    const d = (u["Департамент"] || "").trim() || UNASSIGNED;
    if (!map.has(d)) map.set(d, DEPT_PALETTE[hashStr(d) % DEPT_PALETTE.length]);
  });
  return Array.from(map.entries())
    .map(([name, color]) => ({ name, color }))
    .sort((a, b) =>
      a.name === UNASSIGNED
        ? 1
        : b.name === UNASSIGNED
          ? -1
          : a.name.localeCompare(b.name, "ru"),
    );
});

const groups = computed(() => {
  const map = new Map();
  filtered.value.forEach((u) => {
    const d = (u["Департамент"] || "").trim() || UNASSIGNED;
    if (!map.has(d)) map.set(d, []);
    map.get(d).push(u);
  });
  return Array.from(map.entries())
    .map(([dept, users]) => ({
      dept,
      users,
      color: DEPT_PALETTE[hashStr(dept) % DEPT_PALETTE.length],
    }))
    .sort((a, b) =>
      a.dept === UNASSIGNED
        ? 1
        : b.dept === UNASSIGNED
          ? -1
          : a.dept.localeCompare(b.dept, "ru"),
    );
});

const stats = computed(() => ({
  total: data.value.length,
  depts: new Set(
    data.value.map((u) => (u["Департамент"] || "").trim()).filter(Boolean),
  ).size,
  noIp: data.value.filter((u) => !u["IP адрес"]).length,
  noMac: data.value.filter((u) => !normalizeMac(u["MAC адрес"]).length).length,
}));

// ── Methods ──
function copyIP(ip) {
  const v = String(ip || "").trim();
  if (!v) return;
  copyText(v);
  copiedIp.value = v;
  if (ipTimer) clearTimeout(ipTimer);
  ipTimer = setTimeout(() => {
    copiedIp.value = "";
  }, 1800);
  showToast("✓ IP скопирован");
}

function openEdit(user) {
  editedUser.value = user;
}
function closeEdit() {
  editedUser.value = null;
}

function addUser() {
  const u = { id: idCounter.value++ };
  FIELDS.forEach((f) => {
    u[f] = "";
  });
  data.value.push(u);
  openEdit(u);
}

function onDeleteFromDialog(user) {
  closeEdit();
  deleteConfirm.value = { user };
}
function askDelete(e, user) {
  e.stopPropagation();
  deleteConfirm.value = { user };
}
function cancelDelete() {
  deleteConfirm.value = null;
}
function confirmDelete() {
  if (!deleteConfirm.value) return;
  const id = deleteConfirm.value.user.id;
  data.value = data.value.filter((u) => u.id !== id);
  if (editedUser.value?.id === id) editedUser.value = null;
  deleteConfirm.value = null;
  showToast("✗ Запись удалена");
}

async function onLoadExcel(e) {
  const file = e?.target?.files?.[0];
  if (!file) return;
  try {
    const rows = await parseExcel(file);
    data.value = rows.map((r) => ({ id: idCounter.value++, ...r }));
    showToast(`✓ Загружено ${rows.length} записей`);
  } catch (err) {
    console.error(err);
    alert("Ошибка чтения файла");
  }
  e.target.value = "";
}

function onExportExcel() {
  if (!data.value.length) return;
  exportExcel(data.value);
  showToast("✓ Файл скачан");
}

function setSort(key) {
  if (sortKey.value === key) sortDir.value *= -1;
  else {
    sortKey.value = key;
    sortDir.value = 1;
  }
}

// ── Keyboard ──
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (editedUser.value) closeEdit();
    else if (deleteConfirm.value) cancelDelete();
  }
});
</script>

<template>
  <AppBar :filtered-count="filtered.length" :total-count="data.length" />

  <StatsBar v-if="data.length" :stats="stats" />

  <Toolbar
    v-model="query"
    :has-data="!!data.length"
    @load-excel="onLoadExcel"
    @export-excel="onExportExcel"
    @add-user="addUser"
  />

  <DeptFilters
    v-if="allDepts.length > 1"
    :depts="allDepts"
    v-model="activeDept"
  />

  <SortBar
    v-if="data.length"
    :sort-key="sortKey"
    :sort-dir="sortDir"
    v-model:view-mode="viewMode"
    @sort="setSort"
  />

  <main class="main">
    <!-- Пусто -->
    <div v-if="filtered.length === 0" class="empty">
      <div class="empty__icon">🗄️</div>
      <div class="empty__title">
        {{ data.length ? "Ничего не найдено" : "Нет записей" }}
      </div>
      <div class="empty__hint">
        {{
          data.length
            ? "Попробуйте изменить фильтры"
            : "Загрузите Excel или нажмите «Добавить»"
        }}
      </div>
    </div>

    <!-- Grid -->
    <CardGrid
      v-else-if="viewMode === 'grid'"
      :groups="groups"
      :copied-ip="copiedIp"
      :mac-drop="macDrop"
      @edit="openEdit"
      @delete="askDelete"
      @copy-ip="copyIP"
      @open-mac-drop="openMacDrop"
    />

    <!-- Table -->
    <TableView
      v-else
      :rows="filtered"
      :sort-key="sortKey"
      :sort-dir="sortDir"
      :copied-ip="copiedIp"
      :mac-drop="macDrop"
      @sort="setSort"
      @edit="openEdit"
      @delete="askDelete"
      @copy-ip="copyIP"
      @open-mac-drop="openMacDrop"
    />
  </main>

  <EditDialog
    :user="editedUser"
    :tab-groups="TAB_GROUPS"
    :checkbox-fields="CHECKBOX_FIELDS"
    @close="closeEdit"
    @delete="onDeleteFromDialog"
  />

  <DeleteConfirm
    :user="deleteConfirm?.user ?? null"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />

  <MacDropdown :mac-drop="macDrop" @copy-fmt="copyMacFmt" />

  <ToastNotification :message="toast" />
</template>

<style scoped>
.main {
  flex: 1;
  padding: 24px 28px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 20px;
  color: var(--muted);
  text-align: center;
}
.empty__icon {
  font-size: 2.5rem;
  opacity: 0.3;
}
.empty__title {
  font-family: "Unbounded", sans-serif;
  font-size: 0.9rem;
}
.empty__hint {
  font-size: 0.72rem;
  letter-spacing: 1px;
  opacity: 0.7;
}
</style>
