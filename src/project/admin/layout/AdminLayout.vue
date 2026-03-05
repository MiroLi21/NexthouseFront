<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAdminAuthStore } from "@/project/admin/stores/adminAuthStore";

const router = useRouter();
const route = useRoute();
const authStore = useAdminAuthStore();

const sidebarOpen = ref(true);

const navLinks = [
  { name: "adminDashboard", label: "لوحة التحكم", icon: "dashboard" },
  { name: "adminServices", label: "الخدمات", icon: "services" },
  { name: "adminCategories", label: "الأقسام", icon: "categories" },
  { name: "adminProjects", label: "الصور", icon: "projects" },
];

function logout() {
  authStore.logout();
  router.push({ name: "adminLogin" });
}
</script>

<template>
  <div class="admin-shell" :class="{ 'sidebar-collapsed': !sidebarOpen }">
    <!-- ─── Sidebar ──────────────────────────────────────── -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <span class="brand-en"
            ><span class="la">N</span><span class="tr">ext</span
            ><span class="la">H</span><span class="tr">ouse</span></span
          >
          <span v-if="sidebarOpen" class="brand-ar">الإدارة</span>
        </div>
        <button class="collapse-btn" @click="sidebarOpen = !sidebarOpen">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 12h18M3 6h18M3 18h18"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="{ name: link.name }"
          class="nav-item"
          :class="{ active: route.name === link.name }"
        >
          <!-- Icons -->
          <svg
            v-if="link.icon === 'dashboard'"
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="3"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <rect
              x="14"
              y="3"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <rect
              x="3"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <rect
              x="14"
              y="14"
              width="7"
              height="7"
              rx="1"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
          <svg
            v-else-if="link.icon === 'services'"
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <polyline
              points="9 22 9 12 15 12 15 22"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-else-if="link.icon === 'categories'"
            class="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
          <svg v-else class="nav-icon" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <circle
              cx="8.5"
              cy="8.5"
              r="1.5"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M21 15l-5-5L5 21"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
          <span v-if="sidebarOpen" class="nav-label">{{ link.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="logout">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <polyline
              points="16 17 21 12 16 7"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <line
              x1="21"
              y1="12"
              x2="9"
              y2="12"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
          <span v-if="sidebarOpen">تسجيل الخروج</span>
        </button>
        <a
          @click.prevent="$router.push({ name: 'home' })"
          href="#"
          class="view-site-btn"
        >
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <line
              x1="2"
              y1="12"
              x2="22"
              y2="12"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
          <span v-if="sidebarOpen">الموقع العام</span>
        </a>
      </div>
    </aside>

    <!-- ─── Main content ──────────────────────────────────── -->
    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Playfair+Display:wght@700&display=swap");

.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #0a0907;
  font-family: "Tajawal", sans-serif;
  direction: rtl;
}

/* ─── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: 240px;
  background: #0d0b08;
  border-left: 1px solid rgba(200, 169, 110, 0.12);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.admin-shell.sidebar-collapsed .sidebar {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(200, 169, 110, 0.1);
  min-height: 72px;
}

.brand {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: hidden;
}
.brand-en {
  font-family: "Playfair Display", serif;
  font-size: 1.2rem;
  font-weight: 700;
  white-space: nowrap;
}
.brand-en .la {
  background: linear-gradient(135deg, #fff5cc 0%, #ffd97d 40%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(255, 200, 80, 0.45));
  font-style: italic;
}
.brand-en .tr {
  background: linear-gradient(135deg, #c8a96e 0%, #e8d5a3 50%, #c8a96e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.brand-ar {
  font-size: 0.7rem;
  color: rgba(200, 169, 110, 0.5);
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.collapse-btn {
  background: rgba(200, 169, 110, 0.07);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 8px;
  padding: 0.4rem;
  color: rgba(200, 169, 110, 0.6);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.collapse-btn:hover {
  background: rgba(200, 169, 110, 0.15);
  color: #c8a96e;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 0.75rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  color: rgba(245, 240, 232, 0.55);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover {
  background: rgba(200, 169, 110, 0.08);
  color: rgba(245, 240, 232, 0.85);
}
.nav-item.active {
  background: rgba(200, 169, 110, 0.14);
  color: #c8a96e;
  border: 1px solid rgba(200, 169, 110, 0.2);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(200, 169, 110, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.logout-btn,
.view-site-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
}
.logout-btn {
  background: none;
  border: none;
  color: rgba(245, 240, 232, 0.45);
  font-family: "Tajawal", sans-serif;
  width: 100%;
}
.logout-btn:hover {
  background: rgba(220, 50, 50, 0.1);
  color: #f87171;
}

.view-site-btn {
  text-decoration: none;
  color: rgba(200, 169, 110, 0.5);
}
.view-site-btn:hover {
  background: rgba(200, 169, 110, 0.08);
  color: #c8a96e;
}

/* ─── Main ────────────────────────────────────────── */
.admin-main {
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
}

/* ─── Responsive ──────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  .admin-shell.sidebar-collapsed .sidebar {
    width: 0;
    overflow: hidden;
    border: none;
  }
}
</style>
