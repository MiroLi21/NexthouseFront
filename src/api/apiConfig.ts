import axios from "axios";
import router from "@/router";

const TOKEN_KEY = "nh_admin_token";

const Api = axios.create({
  baseURL: "http://nexthouse.it.com/api",
});

Api.defaults.withCredentials = false;
Api.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
Api.defaults.headers.common["Accept"] = "application/json";

// ─── Request Interceptor ───────────────────────────────────────
// Reads token from localStorage on EVERY request so it's always
// up-to-date, even after a page refresh.
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete config.headers["Authorization"];
  }
  // Let the browser set Content-Type for FormData (multipart)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response ? error.response.status : null;

    if (statusCode === 404) {
      console.warn("Resource not found:", error.config?.url);
      router.back();
    }

    // 401 on an admin route → redirect to admin login
    if (statusCode === 401) {
      const currentPath = router.currentRoute.value.path;
      if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
        localStorage.removeItem(TOKEN_KEY);
        router.push({ name: "adminLogin" });
      }
    }

    return Promise.reject(error);
  },
);

export default Api;
