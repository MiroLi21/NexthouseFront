import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { ISubcategory } from "../types/ISubcategory";
import { mockSubcategories } from "../data/mockData";

export const useSubcategoryStore = defineStore("subcategoryStore", () => {
  const subcategories = ref<ISubcategory[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getSubcategories(serviceId: number): Promise<ISubcategory[]> {
    loading.value = true;
    error.value = null;
    try {
      const response = await Api.get(
        `/public/services/${serviceId}/categories`,
      );
      if (response.data.success) {
        subcategories.value = response.data.data;
        return subcategories.value;
      }
      return filterMock(serviceId);
    } catch {
      subcategories.value = filterMock(serviceId);
      return subcategories.value;
    } finally {
      loading.value = false;
    }
  }

  function filterMock(serviceId: number): ISubcategory[] {
    return mockSubcategories.filter((s) => s.service_id === serviceId);
  }

  async function getSubcategory(id: number): Promise<ISubcategory | undefined> {
    return (
      subcategories.value.find((s) => s.id === id) ||
      mockSubcategories.find((s) => s.id === id)
    );
  }

  return { subcategories, loading, error, getSubcategories, getSubcategory };
});
