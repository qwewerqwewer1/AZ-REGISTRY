import {
  FIELDS,
  SEARCH_KEYS,
  TAB_GROUPS,
  DEPT_PALETTE,
  UNASSIGNED_DEPARTMENT,
} from "AZ-REGESTRY/js/constants.js";

import { hashString, filterByQuery } from "AZ-REGESTRY/js/utils.js";
import { parseExcel } from "AZ-REGESTRY/js/excel-service.js";
import {
  AppBar,
  Toolbar,
  UserCard,
  EmptyState,
  EditDialog,
} from "AZ-REGESTRY/js/components.js";

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
