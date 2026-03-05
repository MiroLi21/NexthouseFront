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
import { Icon } from "@iconify/vue";

type ShowFn<T> = (item: T) => string;

const props = defineProps({
  modelValue: { type: Array as PropType<any[]>, default: () => [] },
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
  maxSelected: { type: Number, default: 0 },

  /** NEW: control row action buttons */
  showEdit: { type: Boolean, default: false },
  showDelete: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "update:modelValue", v: any[]): void;
  (e: "change", v: any[]): void;
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
const labelFor = (item: any): string => {
  if (!item) return "";
  if (typeof props.shownData === "function")
    return (props.shownData as ShowAny)(item);
  const key = props.shownData as string;
  return item?.[key] != null ? String(item[key]) : "";
};

// Helper to check if an item is selected
const isItemSelected = (item: any): boolean => {
  if (!props.modelValue || props.modelValue.length === 0) return false;
  if (props.itemKey) {
    const key = props.itemKey;
    const itemKeyVal = (item as any)?.[key];
    return props.modelValue.some((v) => (v as any)?.[key] === itemKeyVal);
  }
  return props.modelValue.includes(item);
};

const filtered = computed(() => {
  const q = inputValue.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => labelFor(o).toLowerCase().includes(q));
});

const visible = computed(() => {
  const lim = Number(props.limit) || 0;
  return lim > 0 ? filtered.value.slice(0, lim) : filtered.value;
});

watch(
  () => isOpen.value,
  async (open) => {
    if (open) {
      highlightedIndex.value = visible.value.length ? 0 : -1;
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
        toggleSelection(highlightedIndex.value);
      } else {
        const q = inputValue.value.trim();
        if (q) {
          emit("create", q);
        }
      }
      break;
    case "Escape":
      ev.preventDefault();
      close();
      inputValue.value = "";
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

function toggleSelection(i: number) {
  if (i < 0 || i >= visible.value.length) return;
  const item = visible.value[i];

  let newValue: any[];
  const currentlySelected = isItemSelected(item);

  if (currentlySelected) {
    // Remove from selection
    if (props.itemKey) {
      const key = props.itemKey;
      const itemKeyVal = (item as any)?.[key];
      newValue = props.modelValue.filter(
        (v) => (v as any)?.[key] !== itemKeyVal,
      );
    } else {
      newValue = props.modelValue.filter((v) => v !== item);
    }
  } else {
    // Add to selection
    // Check for maxSelected limit
    if (props.maxSelected > 0 && props.modelValue.length >= props.maxSelected) {
      return;
    }
    newValue = [...props.modelValue, item];
  }

  emit("update:modelValue", newValue);
  emit("change", newValue);
  inputValue.value = ""; // Clear search after selection
}

function onItemMouseEnter(i: number) {
  highlightedIndex.value = i;
}

function onItemClick(i: number) {
  toggleSelection(i);
}

function removeSelectedItem(item: any) {
  let newValue: any[];
  if (props.itemKey) {
    const key = props.itemKey;
    const itemKeyVal = (item as any)?.[key];
    newValue = props.modelValue.filter((v) => (v as any)?.[key] !== itemKeyVal);
  } else {
    newValue = props.modelValue.filter((v) => v !== item);
  }
  emit("update:modelValue", newValue);
  emit("change", newValue);
}

function onEditClick(i: number, e: MouseEvent) {
  e.stopPropagation();
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
  if (!root.contains(ev.target as Node)) {
    close();
    inputValue.value = "";
  }
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
      class="flex min-h-[2.25rem] w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 md:text-sm"
      :class="{ 'pointer-events-none opacity-50': disabled }"
      @click="() => { (inputRef as any)?.focus(); open(); }"
    >
      <!-- Selected items as chips -->
      <div
        v-if="modelValue && modelValue.length > 0"
        class="flex flex-wrap gap-1.5 flex-1"
      >
        <span
          v-for="(item, idx) in modelValue"
          :key="itemKey ? (item as any)[itemKey] : idx"
          class="inline-flex items-center gap-1 rounded-md bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors hover:bg-blue-200 dark:hover:bg-blue-900/50"
        >
          <span class="truncate max-w-[120px]">{{
            typeof shownData === "function"
              ? (shownData as any)(item)
              : (item as any)[shownData as string]
          }}</span>
          <button
            type="button"
            class="shrink-0 rounded-sm hover:bg-blue-300 dark:hover:bg-blue-800 p-0.5 transition-colors"
            @click.stop="removeSelectedItem(item)"
            :disabled="disabled"
          >
            <Icon icon="heroicons:x-mark" class="h-3 w-3" />
          </button>
        </span>
      </div>

      <!-- Input field -->
      <input
        ref="inputRef"
        :placeholder="
          maxSelected > 0 && modelValue.length >= maxSelected
            ? 'Limit reached'
            : modelValue && modelValue.length > 0
            ? 'Add more...'
            : placeholder
        "
        :disabled="
          disabled || (maxSelected > 0 && modelValue.length >= maxSelected)
        "
        class="min-w-[120px] flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
        :value="inputValue"
        @input="onInput"
        @focus="onFocus"
        @keydown="keyDown"
      />

      <!-- chevron -->
      <button
        type="button"
        class="shrink-0 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
        :disabled="disabled"
        @click.stop="toggle()"
      >
        <svg
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
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
        class="absolute z-50 mt-2 max-h-[--maxH] w-full overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-1 shadow-xl ring-1 ring-black/5 dark:ring-white/10"
        :style="{ ['--maxH' as any]: props.maxHeight + 'px' }"
        @keydown.stop.prevent="keyDown"
        tabindex="0"
      >
        <!-- options -->
        <li
          v-for="(opt, i) in visible"
          :key="itemKey ? (opt as any)[itemKey] : i"
          role="option"
          :aria-selected="isItemSelected(opt)"
          class="flex cursor-pointer select-none items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="[
            i === highlightedIndex
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700/50',
            maxSelected > 0 &&
            modelValue.length >= maxSelected &&
            !isItemSelected(opt)
              ? 'opacity-50 cursor-not-allowed grayscale-[0.5]'
              : '',
          ]"
          @mouseenter="onItemMouseEnter(i)"
          @mousedown.prevent="
            () => {
              if (
                maxSelected > 0 &&
                modelValue.length >= maxSelected &&
                !isItemSelected(opt)
              )
                return;
              onItemClick(i);
            }
          "
        >
          <!-- LEFT: checkbox + option content -->
          <div class="min-w-0 flex-1 flex items-center gap-2">
            <!-- Checkbox indicator -->
            <div
              class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
              :class="
                isItemSelected(opt)
                  ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
                  : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700'
              "
            >
              <Icon
                v-if="isItemSelected(opt)"
                icon="heroicons:check"
                class="h-3 w-3 text-white"
              />
            </div>

            <!-- Option content -->
            <slot
              name="option"
              :item="opt"
              :index="i"
              :highlighted="i === highlightedIndex"
              :selected="isItemSelected(opt)"
              :query="inputValue"
            >
              <span class="truncate">
                {{
                  typeof shownData === "function"
                    ? (shownData as any)(opt)
                    : (opt as any)[shownData as string]
                }}
              </span>
            </slot>
          </div>

          <!-- RIGHT: actions (slot or default buttons) -->
          <div class="shrink-0 flex items-center gap-1">
            <slot name="actions" :item="opt" :index="i">
              <button
                v-if="showEdit"
                class="rounded-md px-2 py-1 text-xs text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                title="Edit"
                @mousedown.stop.prevent="onEditClick(i, $event)"
              >
                Edit
              </button>
              <button
                v-if="showDelete"
                class="rounded-md px-2 py-1 text-xs text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
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
          class="flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
          @mousedown.prevent="
            () => {
              const q = inputValue.trim();
              if (q) {
                emit('create', q);
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
              class="rounded border border-amber-300 dark:border-amber-700 bg-white/60 dark:bg-amber-900/30 px-1 py-0.5 text-xs"
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
