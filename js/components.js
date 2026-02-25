export const AppBar = {
  name: "AppBar",
  template: `
      <header class="v-app-bar">
        <span class="v-app-bar__title">IT Реестр</span>
      </header>
    `,
};

export const Toolbar = {
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

export const UserCard = {
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

export const EmptyState = {
  name: "EmptyState",
  template: `
      <div class="v-empty-state">
        <p class="v-empty-state__text">Нет записей</p>
        <p class="v-empty-state__hint">Загрузите Excel или нажмите «Добавить запись»</p>
      </div>
    `,
};

export const EditDialog = {
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
