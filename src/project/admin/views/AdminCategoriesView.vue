<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminCategoryStore } from "@/project/admin/stores/adminCategoryStore";
import { useAdminServiceStore } from "@/project/admin/stores/adminServiceStore";
import type { ISubcategory } from "@/project/architecture/types/ISubcategory";
import type { IService } from "@/project/architecture/types/IService";

const store = useAdminCategoryStore();
const serviceStore = useAdminServiceStore();

const categories = ref<ISubcategory[]>([]);
const services = ref<IService[]>([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref("");
const success = ref("");
const showForm = ref(false);

const form = ref({ name: "", service_id: 0 });

onMounted(async () => {
  [categories.value, services.value] = await Promise.all([
    store.getAll(),
    serviceStore.getAll(),
  ]);
  loading.value = false;
});

async function handleCreate() {
  if (!form.value.name.trim()) {
    error.value = "اسم القسم مطلوب";
    return;
  }
  if (!form.value.service_id) {
    error.value = "يرجى اختيار الخدمة";
    return;
  }
  submitting.value = true;
  error.value = "";
  success.value = "";
  try {
    await store.create({
      name: form.value.name,
      service_id: form.value.service_id,
    });
    categories.value = store.categories;
    form.value = { name: "", service_id: 0 };
    showForm.value = false;
    success.value = "تمت إضافة القسم بنجاح ✓";
    setTimeout(() => (success.value = ""), 3000);
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? "حدث خطأ";
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
  try {
    await store.remove(id);
    categories.value = store.categories;
  } catch {
    error.value = "فشل الحذف";
  }
}

function serviceName(id: number) {
  return services.value.find((s) => s.id === id)?.name ?? "—";
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">الأقسام</h1>
        <p class="page-sub">إدارة الأقسام الفرعية لكل خدمة</p>
      </div>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? "✕ إلغاء" : "➕ إضافة قسم" }}
      </button>
    </div>

    <Transition name="slide">
      <div v-if="showForm" class="form-card">
        <h3 class="form-title">قسم جديد</h3>
        <div class="form-row">
          <div class="field">
            <label class="field-label">اسم القسم *</label>
            <input
              v-model="form.name"
              type="text"
              class="field-input"
              placeholder="مثال: مودرن"
            />
          </div>
          <div class="field">
            <label class="field-label">الخدمة *</label>
            <select v-model="form.service_id" class="field-input">
              <option value="0" disabled>اختر الخدمة</option>
              <option v-for="s in services" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
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

    <Transition name="err">
      <div v-if="success" class="success-toast">{{ success }}</div>
    </Transition>

    <div class="table-card">
      <div v-if="loading" class="table-loading">
        <div v-for="i in 5" :key="i" class="skeleton-row"></div>
      </div>
      <table v-else-if="categories.length" class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الخدمة</th>
            <th>إجراء</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in categories" :key="c.id">
            <td class="cell-id">{{ c.id }}</td>
            <td class="cell-name">{{ c.name }}</td>
            <td>
              <span class="service-badge">{{
                c.service?.name ?? serviceName(c.service_id)
              }}</span>
            </td>
            <td>
              <button class="del-btn" @click="handleDelete(c.id)">
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
                </svg>
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">لا توجد أقسام. أضف قسماً جديداً!</div>
    </div>
  </div>
</template>

<style scoped>
@import "@/project/admin/styles/admin-common.css";
.service-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 50px;
  color: #c8a96e;
  font-size: 0.8rem;
}
select.field-input option {
  background: #1a1208;
  color: #f5f0e8;
}
</style>
