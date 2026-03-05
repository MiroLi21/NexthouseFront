<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminServiceStore } from "@/project/admin/stores/adminServiceStore";
import { useAdminCategoryStore } from "@/project/admin/stores/adminCategoryStore";
import { useAdminProjectStore } from "@/project/admin/stores/adminProjectStore";

const serviceStore = useAdminServiceStore();
const categoryStore = useAdminCategoryStore();
const projectStore = useAdminProjectStore();

const counts = ref({ services: 0, categories: 0, projects: 0 });
const loading = ref(true);

onMounted(async () => {
  const [s, c, p] = await Promise.all([
    serviceStore.getAll(),
    categoryStore.getAll(),
    projectStore.getAll(),
  ]);
  counts.value = {
    services: s.length,
    categories: c.length,
    projects: p.length,
  };
  loading.value = false;
});

const cards = [
  {
    key: "services",
    label: "الخدمات",
    route: "adminServices",
    icon: "🏠",
    color: "#c8a96e",
  },
  {
    key: "categories",
    label: "الأقسام",
    route: "adminCategories",
    icon: "📁",
    color: "#a07840",
  },
  {
    key: "projects",
    label: "الصور",
    route: "adminProjects",
    icon: "🖼️",
    color: "#c8a96e",
  },
];
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">لوحة التحكم</h1>
      <p class="page-sub">
        مرحباً بك في نظام إدارة
        <span class="nh-brand"
          ><span class="la">N</span>ext<span class="la">H</span>ouse</span
        >
      </p>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid">
      <div
        v-for="card in cards"
        :key="card.key"
        class="stat-card"
        @click="$router.push({ name: card.route })"
      >
        <div class="stat-icon">{{ card.icon }}</div>
        <div class="stat-body">
          <div class="stat-num">
            <span v-if="loading" class="skeleton-num"></span>
            <span v-else>{{ counts[card.key as keyof typeof counts] }}</span>
          </div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
        <div class="stat-arrow">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 10h12M10 4l6 6-6 6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="quick-section">
      <h2 class="section-heading">إجراءات سريعة</h2>
      <div class="quick-grid">
        <RouterLink :to="{ name: 'adminServices' }" class="quick-btn">
          ➕ إضافة خدمة جديدة
        </RouterLink>
        <RouterLink :to="{ name: 'adminCategories' }" class="quick-btn">
          ➕ إضافة قسم جديد
        </RouterLink>
        <RouterLink :to="{ name: 'adminProjects' }" class="quick-btn">
          📤 رفع صورة جديدة
        </RouterLink>
        <a
          @click.prevent="$router.push({ name: 'home' })"
          href="#"
          class="quick-btn quick-btn--outline"
        >
          🌐 معاينة الموقع العام
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem 2.5rem;
  color: #f5f0e8;
  max-width: 1100px;
}

.page-header {
  margin-bottom: 2.5rem;
}
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0 0 0.3rem;
}
.page-sub {
  color: rgba(245, 240, 232, 0.45);
  font-size: 0.9rem;
  margin: 0;
}
.nh-brand {
  font-family: "Playfair Display", serif;
  font-weight: 700;
  background: linear-gradient(135deg, #c8a96e, #e8d5a3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nh-brand .la {
  background: linear-gradient(135deg, #fff5cc 0%, #ffd97d 40%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.stat-card:hover {
  border-color: rgba(200, 169, 110, 0.4);
  background: rgba(200, 169, 110, 0.06);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2rem;
  line-height: 1;
}
.stat-body {
  flex: 1;
}
.stat-num {
  font-size: 2rem;
  font-weight: 700;
  color: #c8a96e;
  line-height: 1;
}
.stat-label {
  color: rgba(245, 240, 232, 0.55);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
.stat-arrow {
  color: rgba(200, 169, 110, 0.4);
}

.skeleton-num {
  display: inline-block;
  width: 40px;
  height: 2rem;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}

/* Quick */
.section-heading {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(245, 240, 232, 0.7);
  margin: 0 0 1rem;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}
.quick-btn {
  display: block;
  padding: 0.85rem 1.25rem;
  background: rgba(200, 169, 110, 0.08);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 12px;
  color: #c8a96e;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.25s ease;
  text-align: center;
  cursor: pointer;
}
.quick-btn:hover {
  background: rgba(200, 169, 110, 0.16);
  border-color: rgba(200, 169, 110, 0.4);
}
.quick-btn--outline {
  background: transparent;
  color: rgba(245, 240, 232, 0.5);
  border-color: rgba(245, 240, 232, 0.1);
}
.quick-btn--outline:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(245, 240, 232, 0.2);
  color: rgba(245, 240, 232, 0.8);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1.5rem 1.25rem;
  }
}
</style>
