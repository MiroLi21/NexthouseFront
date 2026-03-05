# Project Technical Documentation

This document outlines the technical stack and the standardized CRUD (Create, Read, Update, Delete) patterns used in the project.

## 🚀 Technical Stack

The project is built with a modern frontend stack focused on performance, type safety, and developer experience.

### Core Frameworks & Languages

- **Vue 3 (Composition API)**: The core UI framework, utilizing the `<script setup lang="ts">` syntax for better performance and cleaner code.
- **TypeScript**: Used throughout the project to ensure type safety and improve IDE support.
- **Vite**: The build tool and dev server, providing extremely fast hot module replacement (HMR).

### State Management & Routing

- **Pinia**: The official state management library for Vue, used for centralized data handling.
- **Vue Router**: Handles navigation and route-based data fetching.

### Styling & UI

- **Tailwind CSS**: A utility-first CSS framework used for rapid and consistent styling.
- **Radix Vue**: Unstyled, accessible UI components used as primitives.
- **Vant UI**: A mobile-focused component library used for specific UI elements.
- **Lucide Vue Next & Iconify**: Performance-oriented icon libraries.
- **GSAP**: Used for high-performance animations and transitions.

### Utilities & Data Handling

- **Axios**: The HTTP client used for API requests, configured in `@/api/apiConfig`.
- **VueUse**: A collection of essential Vue composition utilities.
- **Moment.js / Day.js / date-fns**: Used for date manipulation and formatting.
- **ApexCharts**: Powerful charting library for data visualization.
- **Vue Sonner**: Used for beautiful alerts and toast notifications.

---

## 🛠️ CRUD "Algorithm" (Implementation Pattern)

The project follows a standardized pattern for CRUD operations to ensure consistency and maintainability.

### 1. Store Layer (`*Store.ts`)

Each module has its own Pinia store. The store acts as the interface between the UI and the Backend API.

```typescript
// Standard Store Structure
export const useModuleStore = defineStore("moduleStore", () => {
  const pathUrl = "/api/endpoint";

  async function get() {
    return await Api.get(`${pathUrl}`);
  }
  async function show(id: number) {
    return await Api.get(`${pathUrl}/${id}`);
  }
  async function store(params: object) {
    return await Api.post(`${pathUrl}`, params);
  }
  async function update(params: object, id: number) {
    return await Api.post(`${pathUrl}/${id}`, params);
  }
  async function _delete(id: number) {
    return await Api.delete(`${pathUrl}/${id}`);
  }

  // Includes shared navigation methods (First, Last, Next, Previous)
  const navigation = createNavigationMethods(pathUrl);

  return { get, show, store, update, _delete, ...navigation };
});
```

### 2. View Layer (`*View.vue`)

The View components follow a consistent lifecycle for handling data:

#### **A. State Initialization**

Data is held in a reactive `ref` object that matches the entity's interface.

```typescript
const item = ref<IInterface>({ id: 0, name: "", ...defaults });
const isAdd = ref(true); // Tracks if we are in "Create" or "Edit" mode
```

#### **B. Data Fetching**

On mount, the component checks the route for an `ID`. If present, it fetches the data.

```typescript
onMounted(async () => {
  const id = Number(route.params.id);
  if (id) {
    isAdd.value = false;
    store.show(id).then((res) => (item.value = res.data.data));
  }
});
```

#### **C. Persistence Actions**

- **Store**: Uses `prepareFormData` to serialize the reactive object and calls `store.store()`. On success, it redirects to the "Edit" route of the newly created item.
- **Update**: Calls `store.update()`.
- **Delete**: Uses a `YesNoDialog` for confirmation, then calls `store._delete()`.

#### **D. Standardized Footer**

The `IFooterCrud` component is used in almost every view to provide a consistent UI for:

- Save / Update / Delete buttons.
- Navigation (Next/Previous/First/Last).
- Search activation.
- Permission-based visibility.

---

## 📂 Project Structure Overview

- `src/components`: Reusable UI primitives (Inputs, Selects, Dialogs).
- `src/project`: Business logic organized by domain (e.g., `vouchers`, `students`, `accounts`).
  - Each domain folder typically contains:
    - `view/`: Vue components.
    - `*Store.ts`: Pinia store.
    - `*Route.ts`: Route definitions.
    - `I*.ts`: TypeScript interfaces.
- `src/utilities`: Helper functions (formatting, CRUD tools, error handling).
- `src/stores`: Global stores (Auth, I18n, Core).

---

## 📝 Key Utilities

- `prepareFormData`: Automatically converts JSON objects to FormData for PHP/Laravel backends.
- `createNavigationMethods`: Centralizes the logic for record-to-record navigation.
- `useNavigation`: A composable that hooks these methods into the component state.
