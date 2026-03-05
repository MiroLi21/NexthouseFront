export default [
  {
    path: "/",
    name: "home",
    component: () => import("@/project/architecture/views/HomeView.vue"),
  },
  {
    path: "/service/:serviceId",
    name: "subcategories",
    component: () =>
      import("@/project/architecture/views/SubcategoriesView.vue"),
  },
  {
    path: "/service/:serviceId/:subcategoryId",
    name: "gallery",
    component: () => import("@/project/architecture/views/GalleryView.vue"),
  },
];
