import { useAdminAuthStore } from "@/project/admin/stores/adminAuthStore";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

export default function adminAuthMiddleware(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const auth = useAdminAuthStore();
  auth.init();
  if (!auth.isAuthenticated) {
    next({ name: "adminLogin" });
  } else {
    next();
  }
}
