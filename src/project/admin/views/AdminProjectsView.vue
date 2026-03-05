<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAdminProjectStore } from "@/project/admin/stores/adminProjectStore";
import { useAdminCategoryStore } from "@/project/admin/stores/adminCategoryStore";
import type { IProject } from "@/project/architecture/types/IProject";
import type { ISubcategory } from "@/project/architecture/types/ISubcategory";

const store = useAdminProjectStore();
const categoryStore = useAdminCategoryStore();

const projects = ref<IProject[]>([]);
const categories = ref<ISubcategory[]>([]);
const loading = ref(true);
const submitting = ref(false);
const error = ref("");
const success = ref("");
const showForm = ref(false);

const form = ref({ description: "", category_id: 0 });
const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

onMounted(async () => {
  [projects.value, categories.value] = await Promise.all([
    store.getAll(),
    categoryStore.getAll(),
  ]);
  loading.value = false;
});

function onFileChange(e: Event) {
  const t = e.target as HTMLInputElement;
  const f = t.files?.[0] ?? null;
  imageFile.value = f;
  if (f) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.value = ev.target?.result as string;
    };
    reader.readAsDataURL(f);
  } else {
    imagePreview.value = null;
  }
}

async function handleCreate() {
  if (!imageFile.value) {
    error.value = "الصورة مطلوبة";
    return;
  }
  if (!form.value.category_id) {
    error.value = "يرجى اختيار القسم";
    return;
  }
  submitting.value = true;
  error.value = "";
  success.value = "";
  try {
    const fd = new FormData();
    fd.append("image", imageFile.value);
    fd.append("category_id", String(form.value.category_id));
    if (form.value.description)
      fd.append("description", form.value.description);
    await store.create(fd);
    projects.value = store.projects;
    form.value = { description: "", category_id: 0 };
    imageFile.value = null;
    imagePreview.value = null;
    showForm.value = false;
    success.value = "تم رفع الصورة بنجاح ✓";
    setTimeout(() => (success.value = ""), 3000);
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? "حدث خطأ أثناء الرفع";
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm("هل أنت متأكد من حذف هذه الصورة؟")) return;
  try {
    await store.remove(id);
    projects.value = store.projects;
  } catch {
    error.value = "فشل الحذف";
  }
}

function catName(id: number) {
  return categories.value.find((c) => c.id === id)?.name ?? "—";
}
</script>

<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">الصور / المشاريع</h1>
        <p class="page-sub">إدارة معرض صور الأقسام</p>
      </div>
      <button class="add-btn" @click="showForm = !showForm">
        {{ showForm ? "✕ إلغاء" : "📤 رفع صورة" }}
      </button>
    </div>

    <!-- Upload Form -->
    <Transition name="slide">
      <div v-if="showForm" class="form-card">
        <h3 class="form-title">رفع صورة جديدة</h3>
        <div class="form-row">
          <!-- Image upload -->
          <div class="field upload-field">
            <label class="field-label">الصورة *</label>
            <label class="upload-zone" :class="{ 'has-image': imagePreview }">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                class="preview-img"
                alt="preview"
              />
              <div v-else class="upload-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <polyline
                    points="17 8 12 3 7 8"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                  <line
                    x1="12"
                    y1="3"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                  />
                </svg>
                <span>اضغط أو اسحب الصورة هنا</span>
              </div>
              <input
                type="file"
                accept="image/*"
                class="upload-input"
                @change="onFileChange"
              />
            </label>
          </div>

          <div class="field-col">
            <div class="field">
              <label class="field-label">القسم *</label>
              <select v-model="form.category_id" class="field-input">
                <option value="0" disabled>اختر القسم</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.name }}
                </option>
              </select>
            </div>
            <div class="field">
              <label class="field-label">الوصف (اختياري)</label>
              <textarea
                v-model="form.description"
                class="field-input field-textarea"
                rows="3"
                placeholder="وصف مختصر للتصميم..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <Transition name="err">
            <span v-if="error" class="inline-error">{{ error }}</span>
          </Transition>
          <button class="save-btn" :disabled="submitting" @click="handleCreate">
            <span v-if="!submitting">رفع الصورة</span>
            <span v-else class="spinner"></span>
          </button>
        </div>
      </div>
    </Transition>

    <Transition name="err">
      <div v-if="success" class="success-toast">{{ success }}</div>
    </Transition>

    <!-- Loading skeleton -->
    <div v-if="loading" class="img-grid">
      <div v-for="i in 8" :key="i" class="img-skeleton"></div>
    </div>

    <!-- Projects Grid -->
    <div v-else-if="projects.length" class="img-grid">
      <div v-for="p in projects" :key="p.id" class="img-card">
        <img
          :src="p.image_url"
          :alt="p.description ?? ''"
          class="img-thumb"
          loading="lazy"
        />
        <div class="img-info">
          <span class="cat-badge">{{
            p.category?.name ?? catName(p.category_id)
          }}</span>
          <p v-if="p.description" class="img-desc">{{ p.description }}</p>
        </div>
        <button class="img-del-btn" @click="handleDelete(p.id)" title="حذف">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <div v-else class="table-card">
      <div class="empty">لا توجد صور. ارفع أول صورة!</div>
    </div>
  </div>
</template>

<style scoped>
@import "@/project/admin/styles/admin-common.css";

/* Upload zone */
.upload-zone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 160px;
  background: rgba(255, 255, 255, 0.03);
  border: 2px dashed rgba(200, 169, 110, 0.2);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.25s;
}
.upload-zone:hover {
  border-color: rgba(200, 169, 110, 0.45);
}
.upload-zone.has-image {
  border-style: solid;
  border-color: rgba(200, 169, 110, 0.3);
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(200, 169, 110, 0.4);
  font-size: 0.8rem;
  text-align: center;
  pointer-events: none;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.field-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field-textarea {
  resize: vertical;
  min-height: 80px;
}

select.field-input option {
  background: #1a1208;
  color: #f5f0e8;
}

/* Image grid */
.img-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.img-skeleton {
  aspect-ratio: 4/3;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.04) 25%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.img-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(200, 169, 110, 0.1);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.25s;
}
.img-card:hover {
  border-color: rgba(200, 169, 110, 0.3);
}

.img-thumb {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}
.img-info {
  padding: 0.6rem 0.75rem;
}
.cat-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: rgba(200, 169, 110, 0.1);
  border: 1px solid rgba(200, 169, 110, 0.2);
  border-radius: 50px;
  color: #c8a96e;
  font-size: 0.75rem;
}
.img-desc {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: rgba(245, 240, 232, 0.45);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.img-del-btn {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 28px;
  height: 28px;
  background: rgba(220, 50, 50, 0.85);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.img-card:hover .img-del-btn {
  opacity: 1;
}
</style>
