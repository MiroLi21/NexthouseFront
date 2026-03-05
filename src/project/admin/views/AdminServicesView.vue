<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminServiceStore } from "@/project/admin/stores/adminServiceStore";
import type { IService } from "@/project/architecture/types/IService";

const store = useAdminServiceStore();
const services = ref<IService[]>([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref("");
const success = ref("");

const form = ref({ name: "" });
const iconFile = ref<File | null>(null);
const showForm = ref(false);

onMounted(async () => {
  services.value = await store.getAll();
  loading.value = false;
});

function onFileChange(e: Event) {
  const t = e.target as HTMLInputElement;
  iconFile.value = t.files?.[0] ?? null;
}

async function handleCreate() {
  if (!form.value.name.trim()) {
    error.value = "اسم الخدمة مطلوب";
    return;
  }
  submitting.value = true;
  error.value = "";
  success.value = "";
  try {
    const fd = new FormData();
    fd.append("name", form.value.name);
    if (iconFile.value) fd.append("icon", iconFile.value);
    await store.create(fd);
    services.value = store.services;
    form.value.name = "";
    iconFile.value = null;
    showForm.value = false;
    success.value = "تمت إضافة الخدمة بنجاح ✓";
    setTimeout(() => (success.value = ""), 3000);
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? "حدث خطأ أثناء الإضافة";
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
  try {
    await store.remove(id);
    services.value = store.services;
  } catch {
    error.value = "فشل الحذف";
  }
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">الخدمات</h1>
        <p class="page-sub">إدارة الخدمات الرئيسية للموقع</p>
      </div>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? "✕ إلغاء" : "➕ إضافة خدمة" }}
      </button>
    </div>

    <!-- Add Form -->
    <Transition name="slide">
      <div v-if="showForm" class="form-card">
        <h3 class="form-title">خدمة جديدة</h3>
        <div class="form-row">
          <div class="field">
            <label class="field-label">اسم الخدمة *</label>
            <input
              v-model="form.name"
              type="text"
              class="field-input"
              placeholder="مثال: غرف"
            />
          </div>
          <div class="field">
            <label class="field-label">أيقونة (اختياري)</label>
            <input
              type="file"
              accept="image/*"
              class="field-input file-input"
              @change="onFileChange"
            />
          </div>
        </div>
        <div class="form-actions">
          <Transition name="err">
            <span v-if="error" class="inline-error">{{ error }}</span>
          </Transition>
          <button class="save-btn" :disabled="submitting" @click="handleCreate">
            <span v-if="!submitting">حفظ</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Success toast -->
    <Transition name="err">
      <div v-if="success" class="success-toast">{{ success }}</div>
    </Transition>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <div v-for="i in 4" :key="i" class="skeleton-row"></div>
      </div>
      <table v-else-if="services.length" class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الأيقونة</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in services" :key="s.id">
            <td class="cell-id">{{ s.id }}</td>
            <td class="cell-name">{{ s.name }}</td>
            <td>
              <img
                v-if="s.icon_url"
                :src="s.icon_url"
                alt=""
                class="icon-preview"
              />
              <span v-else class="no-icon">—</span>
            </td>
            <td>
              <button class="del-btn" @click="handleDelete(s.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="3 6 5 6 21 6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <path
                    d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <path
                    d="M10 11v6M14 11v6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">لا توجد خدمات بعد. أضف خدمة جديدة!</div>
    </div>
  </div>
</template>

<style scoped>
@import "@/project/admin/styles/admin-common.css";
.icon-preview {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 6px;
}
.no-icon {
  color: rgba(245, 240, 232, 0.25);
  font-size: 0.85rem;
}
</style>
