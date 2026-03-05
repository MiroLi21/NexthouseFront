<script setup lang="ts">
import {
  computed,
  onMounted,
  onBeforeUnmount,
  ref,
  watch,
  nextTick,
} from "vue";
import type { PropType } from "vue";
type ShowFn<T> = (item: T) => string;

const props = defineProps({
  modelValue: { type: Object as PropType<any | null>, default: null },
  options: { type: Array as PropType<any[]>, required: true },
  shownData: {
    type: [String, Function] as PropType<string | ShowFn<any>>,
    required: true,
  },
  itemKey: { type: String, default: "" },
  placeholder: { type: String, default: "Select..." },
  disabled: { type: Boolean, default: false },
  maxHeight: { type: Number, default: 240 },
  defaultOpen: { type: Boolean, default: false },
  noDataText: { type: String, default: "There is no data like" },
  createCtaText: { type: String, default: "Do you want to add it?" },
  limit: { type: Number, default: 0 },

  /** NEW: control row action buttons */
  showEdit: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: any | null): void;
  (e: "change", v: any | null): void;
  (e: "enter", v: any | null): void;
  (e: "create", query: string): void;
  (e: "open"): void;
  (e: "close"): void;
  (e: "keydown", ev: KeyboardEvent): void;
  (e: "input", v: string): void;

  /** NEW row action events */
  (e: "edit", item: any): void;
  (e: "delete", item: any): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const listRef = ref<HTMLUListElement | null>(null);

const isOpen = ref<boolean>(props.defaultOpen && !props.disabled);
const highlightedIndex = ref<number>(-1);
const inputValue = ref<string>("");

type ShowAny = ShowFn<any>;

// Helper to get nested property values (e.g., "Account.name")
const getNestedValue = (obj: any, path: string): any => {
  if (!obj) return undefined;
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value == null) return undefined;
    value = value[key];
  }
  return value;
};

const labelFor = (item: any): string => {
  if (!item) return "";
  if (typeof props.shownData === "function")
    return (props.shownData as ShowAny)(item);
  const key = props.shownData as string;
  const value = getNestedValue(item, key);
  return value != null ? String(value) : "";
};

watch(
  () => props.modelValue,
  (v) => {
    inputValue.value = v ? labelFor(v) : "";
  },
  { immediate: true },
);

const filtered = computed(() => {
  const q = inputValue.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => labelFor(o).toLowerCase().includes(q));
});

const visible = computed(() => {
  const lim = Number(props.limit) || 0;
  return lim > 0 ? filtered.value.slice(0, lim) : filtered.value;
});

const indexOfValue = computed(() => {
  if (!props.modelValue) return -1;
  if (props.itemKey) {
    const key = props.itemKey;
    const valKey = (props.modelValue as any)?.[key];
    return props.options.findIndex((o) => (o as any)?.[key] === valKey);
  }
  return props.options.indexOf(props.modelValue);
});

watch(
  () => isOpen.value,
  async (open) => {
    if (open) {
      highlightedIndex.value = visible.value.length
        ? Math.max(
            0,
            Math.min(visible.value.length - 1, Math.max(0, indexOfValue.value)),
          )
        : -1;
      await nextTick();
      scrollHighlightedIntoView();
      emit("open");
    } else {
      emit("close");
    }
  },
);

function open() {
  if (!props.disabled) isOpen.value = true;
}
function close() {
  isOpen.value = false;
}
function toggle() {
  if (!props.disabled) isOpen.value = !isOpen.value;
}

function clear() {
  if (props.disabled) return;
  inputValue.value = "";
  emit("update:modelValue", null);
  emit("change", null);
  emit("input", "");
}

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  inputValue.value = val;
  emit("input", val);
  if (!isOpen.value) open();
  highlightedIndex.value = visible.value.length ? 0 : -1;
  nextTick(scrollHighlightedIntoView);
}
function onFocus() {
  if (!isOpen.value) open();
}

function keyDown(ev: KeyboardEvent) {
  emit("keydown", ev);
  if (props.disabled) return;

  switch (ev.key) {
    case "ArrowDown":
      ev.preventDefault();
      isOpen.value ? moveHighlight(1) : open();
      break;
    case "ArrowUp":
      ev.preventDefault();
      isOpen.value ? moveHighlight(-1) : open();
      break;
    case "Home":
      ev.preventDefault();
      open();
      highlightedIndex.value = visible.value.length ? 0 : -1;
      scrollHighlightedIntoView();
      break;
    case "End":
      ev.preventDefault();
      open();
      highlightedIndex.value = visible.value.length
        ? visible.value.length - 1
        : -1;
      scrollHighlightedIntoView();
      break;
    case "Enter":
      ev.preventDefault();
      if (!isOpen.value) {
        open();
        break;
      }
      if (visible.value.length > 0 && highlightedIndex.value >= 0) {
        selectIndex(highlightedIndex.value, true);
      } else {
        const q = inputValue.value.trim();
        if (q) {
          emit("create", q);
          close();
        }
      }
      break;
    case "Escape":
      ev.preventDefault();
      close();
      (inputRef.value as HTMLInputElement | null)?.blur?.();
      break;
  }
}

function moveHighlight(delta: number) {
  if (!visible.value.length) return;
  let next = highlightedIndex.value + delta;
  if (next < 0) next = visible.value.length - 1;
  if (next >= visible.value.length) next = 0;
  highlightedIndex.value = next;
  scrollHighlightedIntoView();
}

function selectIndex(i: number, fromEnter = false) {
  if (i < 0 || i >= visible.value.length) return;
  const item = visible.value[i];
  emit("update:modelValue", item);
  emit("change", item);
  emit("enter", item); // always
  inputValue.value = labelFor(item);
  close();
}

function onItemMouseEnter(i: number) {
  highlightedIndex.value = i;
}
function onItemClick(i: number) {
  selectIndex(i, false);
}

function onEditClick(i: number, e: MouseEvent) {
  e.stopPropagation(); // don’t select the row
  e.preventDefault();
  const item = visible.value[i];
  emit("edit", item);
}

function onDeleteClick(i: number, e: MouseEvent) {
  e.stopPropagation();
  e.preventDefault();
  const item = visible.value[i];
  emit("delete", item);
}

function scrollHighlightedIntoView() {
  const list = listRef.value;
  const i = highlightedIndex.value;
  if (!list || i < 0) return;
  const el = list.children[i] as HTMLElement | undefined;
  if (!el) return;
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  const viewTop = list.scrollTop;
  const viewBottom = viewTop + list.clientHeight;
  if (top < viewTop) list.scrollTop = top;
  else if (bottom > viewBottom) list.scrollTop = bottom - list.clientHeight;
}

function handleOutside(ev: MouseEvent) {
  const root = rootRef.value;
  if (!root) return;
  if (!root.contains(ev.target as Node)) close();
}

onMounted(() => document.addEventListener("mousedown", handleOutside));
onBeforeUnmount(() => document.removeEventListener("mousedown", handleOutside));

defineExpose({
  open,
  close,
  focus: () => inputRef.value?.focus(),
});
</script>

<template>
  <div ref="rootRef" class="relative inline-block w-full">
    <!-- control -->
    <div
      class="flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 md:text-sm"
      :class="{ 'pointer-events-none opacity-50': disabled }"
      @click="() => { (inputRef as any)?.focus(); open(); }"
    >
      <slot name="value" :value="modelValue" :label="labelFor(modelValue)">
        <input
          ref="inputRef"
          :placeholder="placeholder"
          :disabled="disabled"
          class="w-full bg-transparent outline-none"
          :value="inputValue"
          @input="onInput"
          @focus="onFocus"
          @keydown="keyDown"
        />
      </slot>

      <!-- clear button -->
      <button
        v-if="modelValue || inputValue"
        type="button"
        class="shrink-0 text-zinc-400 hover:text-zinc-600 mr-1"
        :disabled="disabled"
        @click.stop="clear()"
        title="Clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
          />
        </svg>
      </button>

      <!-- chevron -->
      <button
        type="button"
        class="shrink-0 text-zinc-500 hover:text-zinc-700"
        :disabled="disabled"
        @click.stop="toggle()"
      >
        <svg class="h-4 w-4 transition" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 011.08 1.04l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- dropdown -->
    <transition name="fade-scale">
      <ul
        v-if="isOpen"
        ref="listRef"
        role="listbox"
        class="absolute z-20 mt-2 max-h-[--maxH] w-full overflow-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-lg ring-1 ring-black/5"
        :style="{ ['--maxH' as any]: props.maxHeight + 'px' }"
        @keydown.stop.prevent="keyDown"
        tabindex="0"
      >
        <!-- options -->
        <li
          v-for="(opt, i) in visible"
          :key="itemKey ? (opt as any)[itemKey] : i"
          role="option"
          :aria-selected="i === highlightedIndex"
          class="flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
          :class="
            i === highlightedIndex
              ? 'bg-blue-50 text-blue-700'
              : 'text-zinc-800 hover:bg-zinc-50'
          "
          @mouseenter="onItemMouseEnter(i)"
          @mousedown.prevent="onItemClick(i)"
        >
          <!-- LEFT: option content (slot or default) -->
          <div class="min-w-0 flex-1">
            <slot
              name="option"
              :item="opt"
              :index="i"
              :highlighted="i === highlightedIndex"
              :selected="
                (itemKey && modelValue && (opt as any)[itemKey] === (modelValue as any)[itemKey]) ||
                (!itemKey && modelValue && options.indexOf(opt) === indexOfValue)
              "
              :query="inputValue"
            >
              <span class="truncate">
                {{ labelFor(opt) }}
              </span>
            </slot>
          </div>

          <!-- RIGHT: actions (slot or default buttons) -->
          <div class="shrink-0 flex items-center gap-1">
            <slot name="actions" :item="opt" :index="i">
              <button
                v-if="showEdit"
                class="rounded-md px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                title="Edit"
                @mousedown.stop.prevent="onEditClick(i, $event)"
              >
                Edit
              </button>
              <button
                v-if="showDelete"
                class="rounded-md px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                title="Delete"
                @mousedown.stop.prevent="onDeleteClick(i, $event)"
              >
                Delete
              </button>
            </slot>
          </div>
        </li>

        <!-- empty state -->
        <li
          v-if="visible.length === 0"
          class="flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm bg-amber-50 text-amber-800"
          @mousedown.prevent="
            () => {
              const q = inputValue.trim();
              if (q) {
                emit('create', q);
                close();
              }
            }
          "
        >
          <slot name="empty" :query="inputValue">
            <span class="truncate">
              {{ noDataText }} "<strong>{{ inputValue }}</strong
              >" — {{ createCtaText }}
            </span>
            <kbd
              class="rounded border border-amber-300 bg-white/60 px-1 py-0.5 text-xs"
              >Enter</kbd
            >
          </slot>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
