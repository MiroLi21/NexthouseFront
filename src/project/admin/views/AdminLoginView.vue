<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdminAuthStore } from "@/project/admin/stores/adminAuthStore";

const router = useRouter();
const authStore = useAdminAuthStore();

const form = ref({ user_name: "admin", password: "Admin@1234" });
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

async function handleLogin() {
  if (!form.value.user_name || !form.value.password) {
    error.value = "يرجى ملء جميع الحقول";
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    await authStore.login(form.value);
    router.push({ name: "adminDashboard" });
  } catch (e: any) {
    error.value =
      e?.response?.data?.message ?? "بيانات الدخول غير صحيحة، حاول مجدداً";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Background -->
    <div class="login-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="login-card">
      <div class="brand">
        <span class="brand-en"
          ><span class="la">N</span><span class="tr">ext</span
          ><span class="la">H</span><span class="tr">ouse</span></span
        >
        <span class="brand-ar">لوحة التحكم</span>
      </div>

      <h1 class="login-title">تسجيل الدخول</h1>
      <p class="login-sub">للمشرفين والإدارة فقط</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Username -->
        <div class="field">
          <label class="field-label">اسم المستخدم</label>
          <div class="input-wrap">
            <svg
              class="field-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="form.user_name"
              type="text"
              class="field-input"
              placeholder="admin"
              autocomplete="username"
              dir="ltr"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="field">
          <label class="field-label">كلمة المرور</label>
          <div class="input-wrap">
            <svg
              class="field-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M7 11V7a5 5 0 0 1 10 0v4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              placeholder="••••••••"
              autocomplete="current-password"
              dir="ltr"
            />
            <button
              type="button"
              class="toggle-pw"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="!showPassword"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  stroke-width="1.8"
                />
              </svg>
              <svg
                v-else
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <line
                  x1="1"
                  y1="1"
                  x2="23"
                  y2="23"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Error -->
        <Transition name="err">
          <div v-if="error" class="error-msg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
              <line
                x1="12"
                y1="16"
                x2="12.01"
                y2="16"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
              />
            </svg>
            {{ error }}
          </div>
        </Transition>

        <!-- Submit -->
        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">دخول</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <!-- Back to site -->
      <a
        @click.prevent="$router.push({ name: 'home' })"
        href="#"
        class="back-link"
      >
        ← العودة للموقع العام
      </a>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&family=Playfair+Display:wght@700&display=swap");

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0b08;
  font-family: "Tajawal", sans-serif;
  direction: rtl;
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
}

.login-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(200, 169, 110, 0.2) 0%,
    transparent 70%
  );
  top: -150px;
  right: -150px;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(100, 60, 20, 0.18) 0%,
    transparent 70%
  );
  bottom: -100px;
  left: -100px;
}
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(200, 169, 110, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(200, 169, 110, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.login-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 24px;
  padding: 2.5rem 2.25rem;
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(20px);
  animation: fadeUp 0.7s ease;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  margin-bottom: 2rem;
}
.brand-en {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  font-weight: 700;
}
.brand-en .la {
  background: linear-gradient(135deg, #fff5cc 0%, #ffd97d 40%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 12px rgba(255, 200, 80, 0.5));
  font-style: italic;
}
.brand-en .tr {
  background: linear-gradient(135deg, #c8a96e 0%, #e8d5a3 50%, #c8a96e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.brand-ar {
  font-size: 0.8rem;
  color: rgba(200, 169, 110, 0.6);
  letter-spacing: 0.1em;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f5f0e8;
  margin: 0 0 0.3rem;
  text-align: center;
}
.login-sub {
  color: rgba(245, 240, 232, 0.4);
  font-size: 0.85rem;
  text-align: center;
  margin: 0 0 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  font-size: 0.875rem;
  color: rgba(245, 240, 232, 0.7);
  font-weight: 500;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  right: 1rem;
  color: rgba(200, 169, 110, 0.5);
  pointer-events: none;
}
.field-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(200, 169, 110, 0.15);
  border-radius: 12px;
  padding: 0.8rem 2.8rem 0.8rem 3rem;
  color: #f5f0e8;
  font-size: 0.95rem;
  font-family: "Tajawal", sans-serif;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  outline: none;
}
.field-input::placeholder {
  color: rgba(245, 240, 232, 0.25);
}
.field-input:focus {
  border-color: rgba(200, 169, 110, 0.5);
  box-shadow: 0 0 0 3px rgba(200, 169, 110, 0.08);
}

.toggle-pw {
  position: absolute;
  left: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(200, 169, 110, 0.4);
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.toggle-pw:hover {
  color: #c8a96e;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220, 50, 50, 0.1);
  border: 1px solid rgba(220, 50, 50, 0.25);
  border-radius: 10px;
  padding: 0.7rem 1rem;
  color: #f87171;
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #c8a96e, #a07840);
  border: none;
  border-radius: 12px;
  color: #0d0b08;
  font-size: 1rem;
  font-weight: 700;
  font-family: "Tajawal", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 0.25rem;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e8d5a3, #c8a96e);
  box-shadow: 0 8px 24px rgba(200, 169, 110, 0.35);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(13, 11, 8, 0.3);
  border-top-color: #0d0b08;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.back-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(200, 169, 110, 0.5);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}
.back-link:hover {
  color: #c8a96e;
}

.err-enter-active,
.err-leave-active {
  transition: all 0.25s ease;
}
.err-enter-from,
.err-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
