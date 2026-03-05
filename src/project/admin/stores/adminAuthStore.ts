import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Api from "@/api/apiConfig";

const TOKEN_KEY = "nh_admin_token";

export const useAdminAuthStore = defineStore("adminAuthStore", () => {
  const token = ref<string>(localStorage.getItem(TOKEN_KEY) ?? "");

  const isAuthenticated = computed(() => token.value.length > 0);

  async function login(payload: { user_name: string; password: string }) {
    const response = await Api.post("/login", payload);
    const { token: t } = response.data;
    token.value = t;
    localStorage.setItem(TOKEN_KEY, t);
    // Attach header immediately
    Api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    return response;
  }

  function logout() {
    token.value = "";
    localStorage.removeItem(TOKEN_KEY);
    Api.defaults.headers.common["Authorization"] = "";
  }

  function init() {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      token.value = saved;
      Api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
    }
  }

  return { token, isAuthenticated, login, logout, init };
});
