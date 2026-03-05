import { createRouter, createWebHistory } from "vue-router";
import architecture from "@/project/architecture/architectureRoute";
import admin from "@/project/admin/adminRoute";

const router = createRouter({
  history: createWebHistory(import.meta.env.MODE === "production" ? "/" : "/"),
  linkExactActiveClass: "linkExactActiveClass",
  routes: [
    // ─── Public Architecture Site ───────────────────────
    ...architecture,

    // ─── Admin Panel ────────────────────────────────────
    ...admin,

    // ─── Fallback 404 ───────────────────────────────────
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/404.vue"),
    },
  ],
});

export default router;
