import { reactive } from "vue";

export const limits = reactive([
  { name: "10", id: 10, selected: true },
  { name: "24", id: 24, selected: false },
  { name: "50", id: 50, selected: false },
  { name: "All", id: 999999999, selected: false },
]);

export const days = reactive([
  { name: "3", id: 3, selected: true },
  { name: "7", id: 7, selected: false },
  { name: "10", id: 10, selected: false },
  { name: "30", id: 30, selected: false },
]);
