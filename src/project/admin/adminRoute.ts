import adminAuthMiddleware from "./middleware/adminAuthMiddleware";

export default [
  // ─── Redirect /admin → /admin/dashboard ────────────
  {
    path: "/admin",
    redirect: { name: "adminDashboard" },
  },
  // ─── Login (public) ─────────────────────────────────
  {
    path: "/admin/login",
    name: "adminLogin",
    component: () => import("./views/AdminLoginView.vue"),
  },
  // ─── Protected admin area ───────────────────────────
  {
    path: "/admin",
    component: () => import("./layout/AdminLayout.vue"),
    beforeEnter: adminAuthMiddleware,
    children: [
      {
        path: "dashboard",
        name: "adminDashboard",
        component: () => import("./views/AdminDashboardView.vue"),
      },
      {
        path: "services",
        name: "adminServices",
        component: () => import("./views/AdminServicesView.vue"),
      },
      {
        path: "categories",
        name: "adminCategories",
        component: () => import("./views/AdminCategoriesView.vue"),
      },
      {
        path: "projects",
        name: "adminProjects",
        component: () => import("./views/AdminProjectsView.vue"),
      },
    ],
  },
];
