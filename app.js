/////////////////////////////////////// CONSTANTS /////////////////////////////////////
const FIELDS = [
  "Наклейка ДИТ",
  "Доменное имя",
  "MAC адрес",
  "IP адрес",
  "Локация",
  "Здание, кабинет",
  "Департамент",
  "ФИО пользователя",
  "Логин пользователя",
  "Версия Windows",
  "Ключ Windows",
  "Версия Office",
  "Ключ Office",
  "1С",
  "Е1",
  "Content Reader",
  "Acrobat",
  "Характеристика",
  "Партийный номер",
  "Серийный номер",
  "Монитор",
  "Монитор 2",
  "IP-телефон",
  "Другое оборудование",
  "Примечание",
  "Обновление WIN7",
];

const SEARCH_KEYS = ["ФИО пользователя", "Логин пользователя", "IP адрес"];

const DEPT_PALETTE = [
  "#1976D2",
  "#7B1FA2",
  "#00897B",
  "#43A047",
  "#F9A825",
  "#E64A19",
  "#C2185B",
  "#5E35B1",
  "#0097A7",
  "#558B2F",
  "#F57C00",
  "#D32F2F",
  "#455A64",
  "#795548",
];

const TAB_GROUPS = [
  {
    id: "user",
    label: "Пользователь и место",
    fields: [
      "ФИО пользователя",
      "Логин пользователя",
      "Локация",
      "Здание, кабинет",
      "Департамент",
    ],
  },
  {
    id: "pc",
    label: "Компьютер",
    fields: [
      "Наклейка ДИТ",
      "Доменное имя",
      "MAC адрес",
      "IP адрес",
      "Характеристика",
      "Партийный номер",
      "Серийный номер",
      "Монитор",
      "Монитор 2",
    ],
  },
  {
    id: "soft",
    label: "ПО и оборудование",
    fields: [
      "Версия Windows",
      "Ключ Windows",
      "Версия Office",
      "Ключ Office",
      "1С",
      "Е1",
      "Content Reader",
      "Acrobat",
      "IP-телефон",
      "Другое оборудование",
      "Примечание",
      "Обновление WIN7",
    ],
  },
];

const UNASSIGNED_DEPARTMENT = "— Без отдела";

/////////////////////////////////////// COMPONENTS /////////////////////////////////////
const AppBar = {
  name: "AppBar",
  template: `
      <header class="v-app-bar">
        <span class="v-app-bar__title">IT Реестр</span>
      </header>
    `,
};

const Toolbar = {
  name: "Toolbar",
  props: { modelValue: { type: String, default: "" } },
  emits: ["update:modelValue", "add", "load-excel"],
  template: `
      <div class="v-toolbar">
        <div class="v-toolbar__content">
          <div class="v-text-field v-text-field--outlined">
            <input
              type="text"
              class="v-field__input"
              :value="modelValue"
              @input="$emit('update:modelValue', $event.target.value)"
              placeholder="Поиск по ФИО, логину или IP"
            >
          </div>
          <div class="v-toolbar__actions">
            <input type="file" ref="fileInput" @change="$emit('load-excel', $event)" accept=".xlsx,.xls" style="display:none">
            <button type="button" class="v-btn v-btn--variant-outlined" @click="$refs.fileInput?.click()">
              Загрузить Excel
            </button>
            <!-- Add class when the btn is active: v-btn--primary -->
            <button type="button" disabled class="v-btn v-btn--variant-flat " @click="$emit('add')">
              Добавить запись
            </button>
          </div>
        </div>
      </div>
    `,
};

const UserCard = {
  name: "UserCard",
  props: { user: { type: Object, required: true } },
  emits: ["click", "copy-ip"],
  template: `
      <article class="v-card v-card--hover" @click="$emit('click')">
        <div class="v-card__head">
          <div class="v-avatar">{{ (user["ФИО пользователя"] || "?")[0] }}</div>
          <div class="v-card__head-text">
            <h3 class="v-card__title">{{ user["ФИО пользователя"] || "—" }}</h3>
            <p class="v-card__subtitle">{{ user["Логин пользователя"] || "—" }}</p>
          </div>
        </div>
        <div class="v-card__meta">
          <span
            class="v-chip v-chip--copy"
            v-if="user['IP адрес']"
            title="Скопировать IP"
            @click.stop="$emit('copy-ip', user['IP адрес'])"
          >
            <span class="v-chip__label">IP {{ user["IP адрес"] }}</span>
          </span>
          <span class="v-chip v-chip--secondary" v-if="user['Департамент']">
            <span class="v-chip__label">{{ user["Департамент"] }}</span>
          </span>
          <span class="v-chip v-chip--secondary" v-if="user['Здание, кабинет']">
            <span class="v-chip__label">{{ user["Здание, кабинет"] }}</span>
          </span>
        </div>
      </article>
    `,
};

const EmptyState = {
  name: "EmptyState",
  template: `
      <div class="v-empty-state">
        <p class="v-empty-state__text">Нет записей</p>
        <p class="v-empty-state__hint">Загрузите Excel или нажмите «Добавить запись»</p>
      </div>
    `,
};

const EditDialog = {
  name: "EditDialog",
  props: {
    user: { type: Object, default: null },
    tabGroups: { type: Array, default: () => [] },
  },
  emits: ["close"],
  data() {
    return { activeTabIndex: 0 };
  },
  watch: {
    user() {
      this.activeTabIndex = 0;
    },
  },
  template: `
      <div v-if="user" class="v-overlay" @click.self="$emit('close')">
        <div class="v-dialog" role="dialog">
          <div class="v-dialog__head">
            <h2 class="v-dialog__title">Карточка записи</h2>
            <button type="button" class="v-btn v-btn--icon v-btn--size-small" aria-label="Закрыть" @click="$emit('close')">×</button>
          </div>
          <div class="v-tabs">
            <button
              v-for="(tab, idx) in tabGroups"
              :key="tab.id"
              type="button"
              class="v-tab"
              :class="{ 'v-tab--active': activeTabIndex === idx }"
              @click="activeTabIndex = idx"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="v-dialog__body">
            <div class="v-form" v-for="(tab, idx) in tabGroups" v-show="activeTabIndex === idx" :key="tab.id">
              <template v-for="field in tab.fields" :key="field">
                <label class="v-label">{{ field }}</label>
                <input v-model="user[field]" type="text" class="v-field__input v-field__input--form">
              </template>
            </div>
          </div>
          <div class="v-dialog__actions">
            <button type="button" class="v-btn v-btn--variant-text" @click="$emit('close')">Закрыть</button>
            <button type="button" class="v-btn v-btn--variant-flat v-btn--primary" @click="$emit('close')">Сохранить</button>
          </div>
        </div>
      </div>
    `,
};

//////////////////////////// EXCEL-READER ////////////////////////////////////////
function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        const normalizedRows = rawRows.map((row) => {
          const next = {};

          FIELDS.forEach((fieldName) => {
            const sourceKey = findExcelKey(row, fieldName);
            next[fieldName] = sourceKey
              ? row[sourceKey] != null
                ? String(row[sourceKey])
                : ""
              : "";
          });

          return next;
        });

        resolve(normalizedRows);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

////////////////////////////// UTILS FUNCTIONS //////////////////////////////////
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function findExcelKey(row, fieldName) {
  const normalizedFieldName = fieldName.trim().toLowerCase();
  const foundKey = Object.keys(row).find(
    (key) => key.trim().toLowerCase() === normalizedFieldName,
  );
  return foundKey || null;
}

function filterByQuery(items, query, keys) {
  const normalizedQuery = (query || "").toLowerCase().trim();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    keys.some((key) =>
      (item[key] || "").toLowerCase().includes(normalizedQuery),
    ),
  );
}

/////////////////////////////////////// APP /////////////////////////////////////
const App = {
  name: "App",
  components: { AppBar, Toolbar, UserCard, EmptyState, EditDialog },
  data() {
    return {
      fields: FIELDS,
      tabGroups: TAB_GROUPS,
      data: [],
      idCounter: 1,
      searchQuery: "",
      editedUser: null,
      onEscapeHandler: null,
      toastMessage: "",
      toastTimerId: null,
    };
  },
  computed: {
    filteredList() {
      return filterByQuery(this.data, this.searchQuery, SEARCH_KEYS);
    },
    groupedByDepartment() {
      const map = new Map();

      for (const user of this.filteredList) {
        const departmentName =
          (user["Департамент"] || "").trim() || UNASSIGNED_DEPARTMENT;
        if (!map.has(departmentName)) {
          map.set(departmentName, []);
        }
        map.get(departmentName).push(user);
      }

      const groups = Array.from(map.entries()).map(([department, users]) => ({
        department,
        users,
        color: DEPT_PALETTE[hashString(department) % DEPT_PALETTE.length],
      }));

      groups.sort((left, right) => {
        if (left.department === UNASSIGNED_DEPARTMENT) return 1;
        if (right.department === UNASSIGNED_DEPARTMENT) return -1;
        return left.department.localeCompare(right.department, "ru");
      });

      return groups;
    },
  },
  methods: {
    add() {
      const user = { id: this.idCounter++ };
      this.fields.forEach((fieldName) => {
        user[fieldName] = "";
      });
      this.data.push(user);
      this.openPopup(user);
    },
    openPopup(user) {
      this.editedUser = user;
    },
    closePopup() {
      this.editedUser = null;
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.toastTimerId) {
        clearTimeout(this.toastTimerId);
      }
      this.toastTimerId = setTimeout(() => {
        this.toastMessage = "";
        this.toastTimerId = null;
      }, 1600);
    },
    async copyToClipboard(text) {
      const value = String(text || "").trim();
      if (!value) return;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          this.showToast("IP скопирован");
          return;
        }
      } catch (error) {
        console.error("Clipboard API copy failed:", error);
      }

      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const wasCopied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (wasCopied) {
        this.showToast("IP скопирован");
      }
    },
    async onLoadExcel(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;

      try {
        const rows = await parseExcel(file);
        this.data = rows.map((row) => ({ id: this.idCounter++, ...row }));
      } catch (error) {
        console.error(error);
        alert("Ошибка чтения Excel");
      }

      event.target.value = "";
    },
  },
  mounted() {
    this.onEscapeHandler = (event) => {
      if (event.key === "Escape" && this.editedUser) {
        this.closePopup();
      }
    };
    document.addEventListener("keydown", this.onEscapeHandler);
  },
  beforeUnmount() {
    if (this.onEscapeHandler) {
      document.removeEventListener("keydown", this.onEscapeHandler);
    }
    if (this.toastTimerId) {
      clearTimeout(this.toastTimerId);
    }
  },
  template: `
      <div class="v-app">
        <div class="v-app__wrap">
          <AppBar />
          <Toolbar v-model="searchQuery" @add="add" @load-excel="onLoadExcel" />
          <main class="v-main">
            <section class="v-container">
              <h2 class="v-section-title">Записи ({{ filteredList.length }})</h2>
              <EmptyState v-if="filteredList.length === 0" />
              <template v-else>
                <div
                  v-for="group in groupedByDepartment"
                  :key="group.department"
                  class="v-department-group"
                  :style="{ '--dept-color': group.color }"
                >
                  <h3 class="v-department-group__title">
                    {{ group.department }} ({{ group.users.length }})
                  </h3>
                  <div class="v-card-grid">
                    <UserCard
                      v-for="user in group.users"
                      :key="user.id"
                      :user="user"
                      @click="openPopup(user)"
                      @copy-ip="copyToClipboard"
                    />
                  </div>
                </div>
              </template>
            </section>
          </main>
        </div>
        <EditDialog :user="editedUser" :tab-groups="tabGroups" @close="closePopup" />
        <div v-if="toastMessage" class="v-toast">{{ toastMessage }}</div>
      </div>
    `,
};

Vue.createApp(App).mount("#app");
