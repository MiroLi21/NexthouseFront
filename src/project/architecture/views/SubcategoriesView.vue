<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSubcategoryStore } from "@/project/architecture/stores/subcategoryStore";
import { useServiceStore } from "@/project/architecture/stores/serviceStore";
import type { ISubcategory } from "@/project/architecture/types/ISubcategory";
import type { IService } from "@/project/architecture/types/IService";

const router = useRouter();
const route = useRoute();
const subcategoryStore = useSubcategoryStore();
const serviceStore = useServiceStore();

const serviceId = computed(() => Number(route.params.serviceId));
const service = ref<IService | undefined>();
const subcategories = ref<ISubcategory[]>([]);
const loading = ref(true);

const styleIcons = ["🏺", "🔲", "✨"];

onMounted(async () => {
  [service.value, subcategories.value] = await Promise.all([
    serviceStore.getService(serviceId.value),
    subcategoryStore.getSubcategories(serviceId.value),
  ]);
  loading.value = false;
});

function navigateTo(sub: ISubcategory) {
  router.push({
    name: "gallery",
    params: { serviceId: serviceId.value, subcategoryId: sub.id },
  });
}
</script>

<template>
  <div class="nh-sub">
    <!-- Background -->
    <div class="bg-layer">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="grid-bg"></div>
    </div>

    <!-- Nav / Breadcrumb -->
    <nav class="breadcrumb-nav">
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path
            d="M13 4l-6 6 6 6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        الرئيسية
      </button>
      <span class="breadcrumb-sep">›</span>
      <span class="breadcrumb-current">{{ service?.name ?? "..." }}</span>
    </nav>

    <!-- Header -->
    <header class="sub-header">
      <span class="header-tag">اختر النمط</span>
      <h1 class="sub-title">
        <span class="sub-title--service">{{ service?.name }}</span>
      </h1>
      <p class="sub-desc">اختر النمط الذي يناسب ذوقك لعرض المشاريع</p>
    </header>

    <!-- Skeleton -->
    <div v-if="loading" class="sub-grid">
      <div v-for="i in 3" :key="i" class="sub-card sub-card--skeleton"></div>
    </div>

    <!-- Subcategories -->
    <div v-else class="sub-grid">
      <button
        v-for="(sub, index) in subcategories"
        :key="sub.id"
        class="sub-card"
        :style="{ '--i': index }"
        @click="navigateTo(sub)"
      >
        <div class="sub-card__glow"></div>
        <div class="sub-card__inner">
          <div class="style-icon">{{ styleIcons[index % 3] }}</div>
          <h2 class="sub-card__title">{{ sub.name }}</h2>
          <p class="sub-card__hint">اضغط لعرض المعرض</p>
          <div class="sub-card__arrow">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12M10 4l6 6-6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div class="sub-card__num">
          {{ String(index + 1).padStart(2, "0") }}
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Playfair+Display:wght@400;700&display=swap");

.nh-sub {
  min-height: 100vh;
  background: #0d0b08;
  font-family: "Tajawal", sans-serif;
  direction: rtl;
  color: #f5f0e8;
  padding: 0 1.5rem 4rem;
  position: relative;
  overflow: hidden;
}

/* bg */
.bg-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(200, 169, 110, 0.2) 0%,
    transparent 70%
  );
  top: -100px;
  right: -100px;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(100, 60, 20, 0.2) 0%,
    transparent 70%
  );
  bottom: -80px;
  left: -80px;
}
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(200, 169, 110, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(200, 169, 110, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* breadcrumb */
.breadcrumb-nav {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.5rem 0;
  font-size: 0.9rem;
  color: rgba(245, 240, 232, 0.5);
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #c8a96e;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: "Tajawal", sans-serif;
  padding: 0;
  transition: opacity 0.2s;
}
.back-btn:hover {
  opacity: 0.7;
}
.breadcrumb-sep {
  color: rgba(200, 169, 110, 0.4);
}
.breadcrumb-current {
  color: rgba(245, 240, 232, 0.7);
}

/* header */
.sub-header {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem 0 3rem;
  animation: fadeUp 0.7s ease;
}
.header-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 1px solid rgba(200, 169, 110, 0.35);
  border-radius: 50px;
  color: #c8a96e;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
}
.sub-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0 0 0.75rem;
  color: #f5f0e8;
}
.sub-title--service {
  background: linear-gradient(135deg, #c8a96e, #e8d5a3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sub-desc {
  color: rgba(245, 240, 232, 0.5);
  font-size: 1rem;
  margin: 0;
}

/* grid */
.sub-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}

/* card */
.sub-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 169, 110, 0.12);
  border-radius: 24px;
  cursor: pointer;
  overflow: hidden;
  text-align: right;
  min-height: 220px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeUp 0.6s ease both;
  animation-delay: calc(var(--i, 0) * 0.12s);
}
.sub-card:hover {
  transform: translateY(-10px);
  border-color: rgba(200, 169, 110, 0.45);
  background: rgba(200, 169, 110, 0.06);
}
.sub-card:hover .sub-card__glow {
  opacity: 1;
}
.sub-card:hover .sub-card__arrow {
  transform: translateX(-5px);
  color: #c8a96e;
}

.sub-card__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(200, 169, 110, 0.18) 0%,
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.sub-card__inner {
  position: relative;
  z-index: 1;
  padding: 2rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 100%;
}

.style-icon {
  font-size: 2.2rem;
  line-height: 1;
}

.sub-card__title {
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0;
}
.sub-card__hint {
  font-size: 0.85rem;
  color: rgba(245, 240, 232, 0.4);
  margin: 0;
}
.sub-card__arrow {
  margin-top: auto;
  color: rgba(200, 169, 110, 0.45);
  transition: all 0.3s ease;
  display: flex;
  justify-content: flex-start;
}

.sub-card__num {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  font-size: 3.5rem;
  font-weight: 800;
  color: rgba(200, 169, 110, 0.07);
  line-height: 1;
  font-family: "Playfair Display", serif;
  pointer-events: none;
}

/* skeleton */
.sub-card--skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  .sub-grid {
    grid-template-columns: 1fr;
  }
}
</style>
