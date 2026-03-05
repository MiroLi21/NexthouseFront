<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useServiceStore } from "@/project/architecture/stores/serviceStore";
import type { IService } from "@/project/architecture/types/IService";

const router = useRouter();
const serviceStore = useServiceStore();

const services = ref<IService[]>([]);
const loading = ref(true);

// Service icons (emoji fallback when no icon_url)
const serviceIcons: Record<number, string> = {};
const fallbackIcons = ["🛋️", "🍳", "🧺", "🏡"];

onMounted(async () => {
  services.value = await serviceStore.getServices();
  loading.value = false;
});

function getIcon(service: IService, index: number): string {
  return service.icon_url
    ? ""
    : fallbackIcons[index % fallbackIcons.length] ?? "🏠";
}

function navigateTo(service: IService) {
  router.push({ name: "subcategories", params: { serviceId: service.id } });
}
</script>

<template>
  <div class="nh-home">
    <!-- ─── Hero Section ────────────────────────────────── -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb hero-orb--1"></div>
        <div class="hero-orb hero-orb--2"></div>
        <div class="hero-grid"></div>
      </div>

      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span>تميّز في التصميم منذ ٢٠١٠</span>
        </div>

        <h1 class="hero-title">
          <span class="title-en"
            ><span class="la">N</span><span class="tr">ext</span
            ><span class="la">H</span><span class="tr">ouse</span></span
          >
          <span class="title-ar">للتصميم الداخلي والمعماري</span>
        </h1>

        <p class="hero-subtitle">
          نحوّل رؤيتك إلى مساحات استثنائية تجمع بين الجمال والوظيفة
        </p>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">٢٠٠+</span>
            <span class="stat-label">مشروع منجز</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">١٥+</span>
            <span class="stat-label">سنة خبرة</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">٩٨٪</span>
            <span class="stat-label">رضا العملاء</span>
          </div>
        </div>
      </div>

      <div class="hero-scroll-hint">
        <span>اكتشف خدماتنا</span>
        <div class="scroll-arrow">
          <div class="scroll-line"></div>
        </div>
      </div>
    </section>

    <!-- ─── Services Section ──────────────────────────── -->
    <section class="services-section">
      <div class="section-header">
        <span class="section-tag">خدماتنا</span>
        <h2 class="section-title">ماذا نقدم لك؟</h2>
        <p class="section-subtitle">
          من الغرف إلى المنازل الكاملة — نصمم كل تفصيلة بإتقان
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="services-grid">
        <div
          v-for="i in 4"
          :key="i"
          class="service-card service-card--skeleton"
        ></div>
      </div>

      <!-- Services Grid -->
      <div v-else class="services-grid">
        <button
          v-for="(service, index) in services"
          :key="service.id"
          class="service-card"
          :style="{ '--card-index': index }"
          @click="navigateTo(service)"
        >
          <div class="card-glow"></div>
          <div class="card-inner">
            <div class="card-icon-wrap">
              <img
                v-if="service.icon_url"
                :src="service.icon_url"
                :alt="service.name"
                class="card-img-icon"
              />
              <span v-else class="card-emoji">{{
                getIcon(service, index)
              }}</span>
            </div>
            <h3 class="card-title">{{ service.name }}</h3>
            <p class="card-desc">اضغط لعرض التصاميم</p>
            <div class="card-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
        </button>
      </div>
    </section>

    <!-- ─── Contact & Footer ──────────────────────────── -->
    <footer class="nh-footer">
      <div class="footer-inner">
        <!-- Brand -->
        <div class="footer-brand-col">
          <span class="footer-brand-name">
            <span class="la">N</span><span class="tr">ext</span
            ><span class="la">H</span><span class="tr">ouse</span>
          </span>
          <p class="footer-tagline">نحوّل رؤيتك إلى مساحات استثنائية</p>
        </div>

        <!-- Contact -->
        <div class="footer-col">
          <h4 class="footer-col-title">تواصل معنا</h4>
          <a href="tel:+9647700000000" class="footer-contact-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.61 12 19.79 19.79 0 0 1 1.52 3.45 2 2 0 0 1 3.49 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 5.72 5.72l1.83-1.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            +964 770 000 0000
          </a>
          <a href="tel:+9647800000000" class="footer-contact-link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.61 12 19.79 19.79 0 0 1 1.52 3.45 2 2 0 0 1 3.49 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 5.72 5.72l1.83-1.83a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 14.92z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            +964 780 000 0000
          </a>
          <a
            href="https://wa.me/9647700000000"
            target="_blank"
            class="footer-contact-link footer-wa"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            واتساب
          </a>
        </div>

        <!-- Social -->
        <div class="footer-col">
          <h4 class="footer-col-title">تابعنا</h4>
          <div class="social-links">
            <a
              href="https://instagram.com/nexthouse"
              target="_blank"
              class="social-btn"
              title="إنستغرام"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://facebook.com/nexthouse"
              target="_blank"
              class="social-btn"
              title="فيسبوك"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://tiktok.com/@nexthouse"
              target="_blank"
              class="social-btn"
              title="تيك توك"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
            <a
              href="https://youtube.com/@nexthouse"
              target="_blank"
              class="social-btn"
              title="يوتيوب"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <polygon
                  points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          © ٢٠٢٥
          <span class="footer-brand"
            ><span class="la">N</span><span class="tr">ext</span
            ><span class="la">H</span><span class="tr">ouse</span></span
          >
          — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Playfair+Display:wght@400;700&display=swap");

/* ── Root ───────────────────────────────────────────── */
.nh-home {
  min-height: 100vh;
  background: #0d0b08;
  font-family: "Tajawal", sans-serif;
  direction: rtl;
  color: #f5f0e8;
  overflow-x: hidden;
}

/* ── Hero ───────────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem 6rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.hero-orb--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(200, 169, 110, 0.25) 0%,
    transparent 70%
  );
  top: -150px;
  right: -150px;
}
.hero-orb--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(139, 90, 43, 0.2) 0%,
    transparent 70%
  );
  bottom: -100px;
  left: -100px;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(200, 169, 110, 0.04) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(200, 169, 110, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
  animation: fadeUp 0.9s ease;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1.2rem;
  background: rgba(200, 169, 110, 0.12);
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 50px;
  font-size: 0.875rem;
  color: #c8a96e;
  margin-bottom: 2rem;
}
.badge-dot {
  width: 7px;
  height: 7px;
  background: #c8a96e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.title-en {
  font-family: "Playfair Display", serif;
  font-size: clamp(3rem, 10vw, 6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}
.la {
  background: linear-gradient(135deg, #fff5cc 0%, #ffd97d 40%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
  filter: drop-shadow(0 0 14px rgba(255, 200, 80, 0.5));
}
.tr {
  background: linear-gradient(135deg, #c8a96e 0%, #e8d5a3 50%, #c8a96e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title-ar {
  font-size: clamp(1.1rem, 3vw, 1.6rem);
  font-weight: 400;
  color: rgba(245, 240, 232, 0.75);
  letter-spacing: 0.05em;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(245, 240, 232, 0.6);
  margin: 0 0 3rem;
  line-height: 1.7;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.stat-num {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c8a96e;
}
.stat-label {
  font-size: 0.8rem;
  color: rgba(245, 240, 232, 0.5);
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(200, 169, 110, 0.2);
}

.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(245, 240, 232, 0.4);
  font-size: 0.8rem;
  animation: float 3s ease-in-out infinite;
  z-index: 2;
}
.scroll-arrow {
  width: 1px;
  height: 40px;
  position: relative;
  overflow: hidden;
}
.scroll-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, #c8a96e, transparent);
  animation: scrollLine 2s ease-in-out infinite;
}

/* ── Services Section ───────────────────────────────── */
.services-section {
  padding: 5rem 1.5rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.section-tag {
  display: inline-block;
  padding: 0.3rem 1rem;
  border: 1px solid rgba(200, 169, 110, 0.4);
  border-radius: 50px;
  color: #c8a96e;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}
.section-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #f5f0e8;
  margin: 0.5rem 0;
  font-family: "Playfair Display", serif;
}
.section-subtitle {
  color: rgba(245, 240, 232, 0.55);
  font-size: 1rem;
  margin: 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

/* ── Service Card ───────────────────────────────────── */
.service-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 20px;
  padding: 0;
  cursor: pointer;
  text-align: right;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeUp 0.6s ease both;
  animation-delay: calc(var(--card-index, 0) * 0.1s);
  overflow: hidden;
}
.service-card:hover {
  transform: translateY(-8px);
  border-color: rgba(200, 169, 110, 0.5);
  background: rgba(200, 169, 110, 0.07);
}
.service-card:hover .card-glow {
  opacity: 1;
}
.service-card:hover .card-arrow {
  transform: translateX(-4px);
  color: #c8a96e;
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(200, 169, 110, 0.15) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.card-inner {
  position: relative;
  z-index: 1;
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.card-emoji {
  font-size: 2.5rem;
  line-height: 1;
}
.card-img-icon {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0;
  font-family: "Playfair Display", serif;
}
.card-desc {
  font-size: 0.85rem;
  color: rgba(245, 240, 232, 0.45);
  margin: 0;
}
.card-arrow {
  margin-top: 0.5rem;
  color: rgba(200, 169, 110, 0.5);
  transition: all 0.3s ease;
  display: flex;
  justify-content: flex-start;
}

/* Skeleton */
.service-card--skeleton {
  min-height: 200px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* ── Footer ─────────────────────────────────────────── */
.nh-footer {
  border-top: 1px solid rgba(200, 169, 110, 0.12);
  padding: 3.5rem 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
  color: rgba(245, 240, 232, 0.5);
  font-size: 0.875rem;
}
.footer-inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
}
.footer-brand-col {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.footer-brand-name {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
}
.footer-tagline {
  color: rgba(245, 240, 232, 0.4);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.footer-col-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #c8a96e;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 0.25rem;
}
.footer-contact-link {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(245, 240, 232, 0.55);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  direction: ltr;
  justify-content: flex-end;
}
.footer-contact-link:hover {
  color: #c8a96e;
}
.footer-wa {
  color: rgba(37, 211, 102, 0.7);
}
.footer-wa:hover {
  color: #25d366;
}
.social-links {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.social-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(200, 169, 110, 0.07);
  border: 1px solid rgba(200, 169, 110, 0.15);
  color: rgba(200, 169, 110, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.25s ease;
}
.social-btn:hover {
  background: rgba(200, 169, 110, 0.18);
  border-color: rgba(200, 169, 110, 0.45);
  color: #c8a96e;
  transform: translateY(-2px);
}
.footer-bottom {
  border-top: 1px solid rgba(200, 169, 110, 0.08);
  padding: 1.25rem 0;
  text-align: center;
  color: rgba(245, 240, 232, 0.25);
  font-size: 0.8rem;
}
.footer-brand {
  font-family: "Playfair Display", serif;
  font-weight: 700;
}
.footer-brand .la,
.footer-brand-name .la {
  background: linear-gradient(135deg, #fff5cc 0%, #ffd97d 40%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-style: italic;
}
.footer-brand .tr,
.footer-brand-name .tr {
  background: linear-gradient(135deg, #c8a96e 0%, #e8d5a3 50%, #c8a96e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Animations ─────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}
@keyframes scrollLine {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
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

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 768px) {
  .hero-stats {
    gap: 1.25rem;
  }
  .stat-num {
    font-size: 1.4rem;
  }
  .services-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 480px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  .stat-divider {
    display: none;
  }
  .hero-stats {
    gap: 1.5rem;
  }
}
</style>
