import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { ISubcategory } from "@/project/architecture/types/ISubcategory";

export const useAdminCategoryStore = defineStore("adminCategoryStore", () => {
  const categories = ref<ISubcategory[]>([]);
  const loading = ref(false);

  async function getAll() {
    loading.value = true;
    try {
      const res = await Api.get("/nexthouse/categories");
      categories.value = res.data.data ?? res.data;
      return categories.value;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: { name: string; service_id: number }) {
    const res = await Api.post("/nexthouse/categories", payload);
    await getAll();
    return res;
  }

  async function remove(id: number) {
    await Api.delete(`/nexthouse/categories/${id}`);
    categories.value = categories.value.filter((c) => c.id !== id);
  }

  return { categories, loading, getAll, create, remove };
});
