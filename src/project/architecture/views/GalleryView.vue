<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useProjectStore } from "@/project/architecture/stores/projectStore";
import { useSubcategoryStore } from "@/project/architecture/stores/subcategoryStore";
import { useServiceStore } from "@/project/architecture/stores/serviceStore";
import type { IProject } from "@/project/architecture/types/IProject";

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const subcategoryStore = useSubcategoryStore();
const serviceStore = useServiceStore();

const serviceId = computed(() => Number(route.params.serviceId));
const subcategoryId = computed(() => Number(route.params.subcategoryId));

const projects = ref<IProject[]>([]);
const loading = ref(true);
const serviceName = ref("");
const subName = ref("");

// Lightbox state
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const lightboxProject = computed(() => projects.value[lightboxIndex.value]);

onMounted(async () => {
  const [service, sub, projs] = await Promise.all([
    serviceStore.getService(serviceId.value),
    subcategoryStore.getSubcategory(subcategoryId.value),
    projectStore.getProjects(subcategoryId.value),
  ]);
  serviceName.value = service?.name ?? "";
  subName.value = sub?.name ?? "";
  projects.value = projs;
  loading.value = false;
});

// Lightbox controls
function openLightbox(index: number) {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightboxOpen.value = false;
  document.body.style.overflow = "";
}
function nextImage() {
  lightboxIndex.value = (lightboxIndex.value + 1) % projects.value.length;
}
function prevImage() {
  lightboxIndex.value =
    (lightboxIndex.value - 1 + projects.value.length) % projects.value.length;
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return;
  if (e.key === "ArrowLeft") nextImage();
  if (e.key === "ArrowRight") prevImage();
  if (e.key === "Escape") closeLightbox();
}
onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.style.overflow = "";
});
</script>

<template>
  <div class="nh-gallery">
    <!-- Background -->
    <div class="bg-layer">
      <div class="orb orb-1"></div>
      <div class="grid-bg"></div>
    </div>

    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
      <button class="back-btn" @click="router.push({ name: 'home' })">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path
            d="M13 4l-6 6 6 6"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        الرئيسية
      </button>
      <span class="sep">›</span>
      <button
        class="back-btn"
        @click="router.push({ name: 'subcategories', params: { serviceId } })"
      >
        {{ serviceName }}
      </button>
      <span class="sep">›</span>
      <span class="crumb-current">{{ subName }}</span>
    </nav>

    <!-- Header -->
    <header class="gallery-header">
      <span class="header-tag">معرض الصور</span>
      <h1 class="gallery-title">
        <span class="title-highlight">{{ serviceName }}</span>
        <span class="title-sub"> — {{ subName }}</span>
      </h1>
      <p v-if="!loading" class="gallery-count">{{ projects.length }} تصميم</p>
    </header>

    <!-- Skeleton -->
    <div v-if="loading" class="img-grid">
      <div
        v-for="i in 8"
        :key="i"
        class="img-item img-item--skeleton"
        :style="{ '--h': `${200 + (i % 3) * 60}px` }"
      ></div>
    </div>

    <!-- Empty -->
    <div v-else-if="projects.length === 0" class="empty-state">
      <span class="empty-icon">🏠</span>
      <p>لا توجد صور لهذا القسم بعد</p>
    </div>

    <!-- Image Grid -->

    <div v-else class="img-grid">
      <button
        v-for="(project, index) in projects"
        :key="project.id"
        class="img-item"
        :style="{ '--i': index }"
        @click="openLightbox(index)"
      >
        <img
          :src="project.image_url"
          :alt="project.description ?? 'تصميم'"
          class="img-photo"
          loading="lazy"
        />
        <div class="img-overlay">
          <div class="overlay-inner">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span v-if="project.description" class="overlay-desc">{{
              project.description
            }}</span>
          </div>
        </div>
      </button>
    </div>

    <!-- ─── Lightbox ───────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="lb">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <!-- Close -->
          <button class="lb-close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <!-- Counter -->
          <div class="lb-counter">
            {{ lightboxIndex + 1 }} / {{ projects.length }}
          </div>

          <!-- Prev -->
          <button class="lb-nav lb-nav--prev" @click="prevImage">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 4l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>

          <!-- Image -->
          <Transition name="img-fade" mode="out-in">
            <div :key="lightboxIndex" class="lb-img-wrap">
              <img
                :src="lightboxProject?.image_url"
                :alt="lightboxProject?.description ?? 'تصميم'"
                class="lb-img"
              />
              <p v-if="lightboxProject?.description" class="lb-caption">
                {{ lightboxProject.description }}
              </p>
            </div>
          </Transition>

          <!-- Next -->
          <button class="lb-nav lb-nav--next" @click="nextImage">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <path
                d="M12 4L6 10l6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Playfair+Display:wght@400;700&display=swap");

.nh-gallery {
  min-height: 100vh;
  background: #0d0b08;
  font-family: "Tajawal", sans-serif;
  direction: rtl;
  color: #f5f0e8;
  padding: 0 1.5rem 4rem;
  position: relative;
  overflow-x: hidden;
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
  pointer-events: none;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(200, 169, 110, 0.18) 0%,
    transparent 70%
  );
  top: -100px;
  right: -100px;
}
.grid-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(200, 169, 110, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(200, 169, 110, 0.025) 1px, transparent 1px);
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
  font-size: 0.875rem;
  color: rgba(245, 240, 232, 0.45);
  flex-wrap: wrap;
}
.back-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: none;
  border: none;
  color: #c8a96e;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: "Tajawal", sans-serif;
  padding: 0;
  transition: opacity 0.2s;
}
.back-btn:hover {
  opacity: 0.7;
}
.sep {
  color: rgba(200, 169, 110, 0.35);
}
.crumb-current {
  color: rgba(245, 240, 232, 0.7);
}

/* header */
.gallery-header {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 1.5rem 0 2.5rem;
  animation: fadeUp 0.65s ease;
}
.header-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 50px;
  color: #c8a96e;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}
.gallery-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
  margin: 0 0 0.5rem;
}
.title-highlight {
  background: linear-gradient(135deg, #c8a96e, #e8d5a3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title-sub {
  color: rgba(245, 240, 232, 0.6);
}
.gallery-count {
  color: rgba(245, 240, 232, 0.4);
  font-size: 0.9rem;
  margin: 0;
}

/* image grid */
.img-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 1300px;
  margin: 0 auto;
}

.img-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  border: 1px solid rgba(200, 169, 110, 0.1);
  aspect-ratio: 4 / 3;
  animation: fadeUp 0.5s ease both;
  animation-delay: calc(var(--i, 0) * 0.05s);
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.img-item:hover {
  transform: scale(1.02);
  border-color: rgba(200, 169, 110, 0.4);
}
.img-item:hover .img-overlay {
  opacity: 1;
}

.img-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(13, 11, 8, 0.85) 0%,
    rgba(13, 11, 8, 0.2) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1rem;
}
.overlay-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #c8a96e;
}
.overlay-desc {
  font-size: 0.85rem;
  color: rgba(245, 240, 232, 0.85);
  text-align: center;
}

/* skeleton */
.img-item--skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  aspect-ratio: 4/3;
}

/* empty */
.empty-state {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 5rem 1rem;
  color: rgba(245, 240, 232, 0.4);
}
.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

/* ─── Lightbox ─────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(5, 4, 3, 0.96);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb-close {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  width: 44px;
  height: 44px;
  background: rgba(200, 169, 110, 0.12);
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 50%;
  color: #c8a96e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}
.lb-close:hover {
  background: rgba(200, 169, 110, 0.25);
  transform: scale(1.1);
}

.lb-counter {
  position: absolute;
  top: 1.4rem;
  right: 50%;
  transform: translateX(50%);
  color: rgba(245, 240, 232, 0.5);
  font-size: 0.875rem;
  font-family: "Tajawal", sans-serif;
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.25);
  border-radius: 50%;
  color: #c8a96e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  z-index: 10;
}
.lb-nav:hover {
  background: rgba(200, 169, 110, 0.25);
  transform: translateY(-50%) scale(1.1);
}
.lb-nav--prev {
  right: 1.5rem;
}
.lb-nav--next {
  left: 1.5rem;
}

.lb-img-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  max-width: min(90vw, 900px);
  max-height: 90vh;
}
.lb-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
}
.lb-caption {
  color: rgba(245, 240, 232, 0.6);
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

/* ─── Transitions ─────────────────────────────────────── */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.3s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.img-fade-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.img-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

/* Responsive */
@media (max-width: 768px) {
  .img-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .lb-nav--prev {
    right: 0.75rem;
  }
  .lb-nav--next {
    left: 0.75rem;
  }
}
@media (max-width: 480px) {
  .img-grid {
    grid-template-columns: 1fr;
  }
}
</style>
