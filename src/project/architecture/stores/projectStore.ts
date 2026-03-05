import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { IProject } from "../types/IProject";
import { mockProjects } from "../data/mockData";

export const useProjectStore = defineStore("projectStore", () => {
  const projects = ref<IProject[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getProjects(categoryId: number): Promise<IProject[]> {
    loading.value = true;
    error.value = null;
    try {
      const response = await Api.get(
        `/public/categories/${categoryId}/projects`,
      );
      if (response.data.success) {
        projects.value = response.data.data;
        return projects.value;
      }
      return filterMock(categoryId);
    } catch {
      projects.value = filterMock(categoryId);
      return projects.value;
    } finally {
      loading.value = false;
    }
  }

  function filterMock(categoryId: number): IProject[] {
    return mockProjects.filter((p) => p.category_id === categoryId);
  }

  return { projects, loading, error, getProjects };
});
