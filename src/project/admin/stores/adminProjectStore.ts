import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { IProject } from "@/project/architecture/types/IProject";

export const useAdminProjectStore = defineStore("adminProjectStore", () => {
  const projects = ref<IProject[]>([]);
  const loading = ref(false);

  async function getAll() {
    loading.value = true;
    try {
      const res = await Api.get("/nexthouse/projects");
      projects.value = res.data.data ?? res.data;
      return projects.value;
    } finally {
      loading.value = false;
    }
  }

  async function create(formData: FormData) {
    const res = await Api.post("/nexthouse/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await getAll();
    return res;
  }

  async function remove(id: number) {
    await Api.delete(`/nexthouse/projects/${id}`);
    projects.value = projects.value.filter((p) => p.id !== id);
  }

  return { projects, loading, getAll, create, remove };
});
