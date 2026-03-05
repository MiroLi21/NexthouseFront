import { defineStore } from "pinia";
import { ref } from "vue";
import Api from "@/api/apiConfig";
import type { IService } from "../types/IService";
import { mockServices } from "../data/mockData";

export const useServiceStore = defineStore("serviceStore", () => {
  const services = ref<IService[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getServices(): Promise<IService[]> {
    loading.value = true;
    error.value = null;
    try {
      const response = await Api.get("/public/services");
      if (response.data.success) {
        services.value = response.data.data;
        return services.value;
      }
      return mockServices;
    } catch {
      // API not available — fall back to mock data
      services.value = mockServices;
      return mockServices;
    } finally {
      loading.value = false;
    }
  }

  async function getService(id: number): Promise<IService | undefined> {
    if (services.value.length === 0) await getServices();
    return services.value.find((s) => s.id === id);
  }

  return { services, loading, error, getServices, getService };
});
