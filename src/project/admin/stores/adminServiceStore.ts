import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { IService } from "@/project/architecture/types/IService";

export const useAdminServiceStore = defineStore("adminServiceStore", () => {
  const services = ref<IService[]>([]);
  const loading = ref(false);

  async function getAll() {
    loading.value = true;
    try {
      const res = await Api.get("/nexthouse/services");
      services.value = res.data.data ?? res.data;
      return services.value;
    } finally {
      loading.value = false;
    }
  }

  async function create(formData: FormData) {
    const res = await Api.post("/nexthouse/services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await getAll();
    return res;
  }

  async function remove(id: number) {
    await Api.delete(`/nexthouse/services/${id}`);
    services.value = services.value.filter((s) => s.id !== id);
  }

  return { services, loading, getAll, create, remove };
});
