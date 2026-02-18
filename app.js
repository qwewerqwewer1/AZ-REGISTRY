/**
 * IT Реестр — один файл без модулей (работает по file:// без сервера).
 * Vue и XLSX подключаются в index.html через CDN.
 */
(function () {
  "use strict";

  const FIELDS = [
    "Наклейка ДИТ", "Доменное имя", "MAC адрес", "IP адрес", "Локация",
    "Здание, кабинет", "Департамент", "ФИО пользователя", "Логин пользователя",
    "Версия Windows", "Ключ Windows", "Версия Office", "Ключ Office",
    "1С", "Е1", "Content Reader", "Acrobat", "Характеристика",
    "Партийный номер", "Серийный номер", "Монитор", "Монитор 2",
    "IP-телефон", "Другое оборудование", "Примечание", "Обновление WIN7",
  ];

  const SEARCH_KEYS = ["ФИО пользователя", "Логин пользователя", "IP адрес"];

  /* Палитра цветов в стиле Vuetify/Material (для департаментов) */
  const DEPT_PALETTE = [
    "#1976D2", "#7B1FA2", "#00897B", "#43A047", "#F9A825",
    "#E64A19", "#C2185B", "#5E35B1", "#0097A7", "#558B2F",
    "#F57C00", "#D32F2F", "#455A64", "#795548",
  ];
  
  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h) + str.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  /* Группы полей по вкладкам в диалоге редактирования */
  const TAB_GROUPS = [
    {
      id: "user",
      label: "Пользователь и место",
      fields: ["ФИО пользователя", "Логин пользователя", "Локация", "Здание, кабинет", "Департамент"],
    },
    {
      id: "pc",
      label: "Компьютер",
      fields: ["Наклейка ДИТ", "Доменное имя", "MAC адрес", "IP адрес", "Характеристика", "Партийный номер", "Серийный номер", "Монитор", "Монитор 2"],
    },
    {
      id: "soft",
      label: "ПО и оборудование",
      fields: ["Версия Windows", "Ключ Windows", "Версия Office", "Ключ Office", "1С", "Е1", "Content Reader", "Acrobat", "IP-телефон", "Другое оборудование", "Примечание", "Обновление WIN7"],
    },
  ];

  function findExcelKey(row, fieldName) {
    const norm = fieldName.trim().toLowerCase();
    const key = Object.keys(row).find((k) => k.trim().toLowerCase() === norm);
    return key || null;
  }

  function parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          const data = raw.map((row) => {
            const obj = {};
            FIELDS.forEach((f) => {
              const key = findExcelKey(row, f);
              obj[f] = key ? (row[key] != null ? String(row[key]) : "") : "";
            });
            return obj;
          });
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function filterByQuery(items, query, keys) {
    const q = (query || "").toLowerCase().trim();
    if (!q) return items;
    return items.filter((item) =>
      keys.some((key) => (item[key] || "").toLowerCase().includes(q))
    );
  }

  /* —— AppBar: шапка приложения —— */
  const AppBar = {
    name: "AppBar",
    template: `
      <header class="v-app-bar">
        <span class="v-app-bar__title">IT Реестр</span>
      </header>
    `,
  };

  /* —— Toolbar: поиск и действия —— */
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
            <button type="button" class="v-btn v-btn--variant-flat v-btn--primary" @click="$emit('add')">
              Добавить запись
            </button>
          </div>
        </div>
      </div>
    `,
  };

  /* —— UserCard: карточка с аватаром и иерархией данных —— */
  const UserCard = {
    name: "UserCard",
    props: { user: { type: Object, required: true } },
    emits: ["click"],
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
          <span class="v-chip" v-if="user['IP адрес']">
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

  /* —— EmptyState: когда записей нет —— */
  const EmptyState = {
    name: "EmptyState",
    template: `
      <div class="v-empty-state">
        <p class="v-empty-state__text">Нет записей</p>
        <p class="v-empty-state__hint">Загрузите Excel или нажмите «Добавить запись»</p>
      </div>
    `,
  };

  /* —— EditDialog: диалог с вкладками —— */
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
              <template v-for="(field, i) in tab.fields" :key="field">
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
      };
    },
    computed: {
      filteredList() {
        return filterByQuery(this.data, this.searchQuery, SEARCH_KEYS);
      },
      /* Группировка по департаменту для отображения секциями */
      groupedByDepartment() {
        const key = "Департамент";
        const map = new Map();
        for (const user of this.filteredList) {
          const dep = (user[key] || "").trim() || "— Без отдела";
          if (!map.has(dep)) map.set(dep, []);
          map.get(dep).push(user);
        }
        const list = Array.from(map.entries()).map(([department, users]) => ({
          department,
          users,
          color: DEPT_PALETTE[hashString(department) % DEPT_PALETTE.length],
        }));
        list.sort((a, b) => {
          if (a.department === "— Без отдела") return 1;
          if (b.department === "— Без отдела") return -1;
          return a.department.localeCompare(b.department, "ru");
        });
        return list;
      },
    },
    methods: {
      add() {
        const user = { id: this.idCounter++ };
        this.fields.forEach((f) => (user[f] = ""));
        this.data.push(user);
        this.openPopup(user);
      },
      openPopup(user) {
        this.editedUser = user;
      },
      closePopup() {
        this.editedUser = null;
      },
      async onLoadExcel(event) {
        const file = event?.target?.files?.[0];
        if (!file) return;
        try {
          const rows = await parseExcel(file);
          this.data = rows.map((row) => ({ id: this.idCounter++, ...row }));
        } catch (err) {
          console.error(err);
          alert("Ошибка чтения Excel");
        }
        event.target.value = "";
      },
    },
    mounted() {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.editedUser) this.closePopup();
      });
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
                <div v-for="group in groupedByDepartment" :key="group.department" class="v-department-group" :style="{ '--dept-color': group.color }">
                  <h3 class="v-department-group__title">{{ group.department }} ({{ group.users.length }})</h3>
                  <div class="v-card-grid">
                    <UserCard v-for="user in group.users" :key="user.id" :user="user" @click="openPopup(user)" />
                  </div>
                </div>
              </template>
            </section>
          </main>
        </div>
        <EditDialog :user="editedUser" :tab-groups="tabGroups" @close="closePopup" />
      </div>
    `,
  };

  Vue.createApp(App).mount("#app");
})();
