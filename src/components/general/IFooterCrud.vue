<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Button from "../ui/button/Button.vue";
import { Icon } from "@iconify/vue";
import IInput from "../inputs/IInput.vue";
import { EnumInputType } from "@/utilities/EnumSystem";
import { t } from "@/utilities/I18nPlugin";
import { formatNumberClean } from "@/utilities/format";
import { useRoute } from "vue-router";

const props = defineProps({
  onBack: {
    type: Function,
    default: () => {},
  },
  onCreate: {
    type: Function,
    default: () => {},
  },
  onUpdate: {
    type: Function,
    default: () => {},
  },
  onDelete: {
    type: Function,
    default: () => {},
  },
  onSearch: {
    type: Function,
    default: () => {},
  },
  resetForm: {
    type: Function,
    default: () => {},
  },
  checkPermissionAdd: {
    type: Number,
  },
  checkPermissionUpdate: {
    type: Number,
  },
  checkPermissionDelete: {
    type: Number,
  },
  checkPermissionSearch: {
    type: Number,
  },
  isAdd: {
    type: Boolean,
    required: true,
  },
  showUpdate: {
    type: Boolean,
    default: true,
  },
  showDelete: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  showReset: {
    type: Boolean,
    default: true,
  },
  showAdd: {
    type: Boolean,
    default: true,
  },
  titleAdd: {
    type: String,
    default: "Add",
  },
  titleUpdate: {
    type: String,
    default: "Update",
  },
  titleDelete: {
    type: String,
    default: "Delete",
  },
  titleSearch: {
    type: String,
    default: "Search",
  },
  titleReset: {
    type: String,
    default: "Reset",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  lastBalances: {
    type: Array<any>,
    default: [],
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  onFirst: {
    type: Function,
  },
  onLast: {
    type: Function,
  },
  onNext: {
    type: Function,
  },
  onPrevious: {
    type: Function,
  },
  showIDs: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const currentID = ref<number>(0);

// Watch modelValue prop changes and sync to currentID
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== currentID.value) {
      currentID.value = newValue;
    }
  },
  { immediate: true },
);

// Watch currentID changes and emit to parent
watch(currentID, (newValue) => {
  if (newValue !== props.modelValue) {
    emit("update:modelValue", newValue);
  }
});

const route = useRoute();

// Watch route changes and update currentID when route param 'id' changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      const id = Number(newId);
      if (!isNaN(id) && id !== currentID.value) {
        currentID.value = id;
      }
    }
  },
  { immediate: true },
);

const firstID = () => props.onFirst && props.onFirst();
const prevID = () => props.onPrevious && props.onPrevious();
const nextID = () => props.onNext && props.onNext();
const lastID = () => props.onLast && props.onLast();
</script>

<template>
  <div class="sticky bottom-6 py-4 bg-transparent mt-6">
    <div
      class="flex flex-wrap flex-row justify-between items-center p-2 border bg-white dark:bg-black"
    >
      <!-- IDs -->
      <div
        v-if="props.showIDs"
        dir="rtl"
        class="flex items-center justify-center gap-2 px-3"
      >
        <button
          class="p-1.5 rounded-full hover:bg-gray-200 active:scale-95 transition"
          @click="firstID"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          class="p-1.5 rounded-full hover:bg-gray-200 active:scale-95 transition"
          @click="prevID"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <IInput
          v-model="currentID"
          name="currentID"
          :type="EnumInputType.Number"
          id="currentID"
          class="w-16"
        />
        <button
          class="p-1.5 rounded-full hover:bg-gray-200 active:scale-95 transition"
          @click="nextID"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          class="p-1.5 rounded-full hover:bg-gray-200 active:scale-95 transition"
          @click="lastID"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7m-8-14l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <!-- Last Balance -->
      <div
        class="text-md font-bold text-red-500 flex gap-2"
        v-if="props.lastBalances"
      >
        <div v-for="(lastBalance, index) in props.lastBalances" :key="index">
          {{ formatNumberClean(lastBalance.total) }}
          {{ lastBalance.currencySymbol }}
          <span v-if="index < props.lastBalances.length - 1"> - </span>
        </div>
      </div>
      <!-- Buttons -->
      <div class="flex gap-3">
        <Button
          :onClick="props.onBack"
          :isLoading="props.isLoading"
          class="border bg-primary-foreground text-primary-foreground-text hover:bg-primary/30"
          :type="EnumInputType.Text"
        >
          <Icon icon="icon-park-outline:back" />
        </Button>
        <Button
          v-if="props.isAdd && props.showAdd && checkPermissionAdd == 1"
          :onClick="props.onCreate"
          :isLoading="props.isLoading"
          class="focus:scale-105 text-primary-text bg-primary"
        >
          <Icon icon="icon-park-outline:save" />
        </Button>
        <Button
          v-if="props.showReset"
          :isLoading="props.isLoading"
          :onClick="props.resetForm"
          class="border bg-primary-foreground text-primary-foreground-text hover:bg-primary/30"
        >
          <Icon icon="icon-park-outline:add" />
        </Button>

        <Button
          v-if="props.showSearch && checkPermissionSearch == 1"
          :isLoading="props.isLoading"
          :onClick="props.onSearch"
          class="border bg-primary-foreground text-primary-foreground-text hover:bg-primary/30"
        >
          <Icon icon="icon-park-outline:search" />
        </Button>
        <Button
          v-if="!props.isAdd && props.showUpdate && checkPermissionUpdate == 1"
          :onClick="props.onUpdate"
          :isLoading="props.isLoading"
          class="focus:scale-105 bg-primary text-primary-text"
        >
          <Icon icon="icon-park-outline:edit" />
        </Button>
        <Button
          v-if="!props.isAdd && props.showDelete && checkPermissionDelete == 1"
          :isLoading="props.isLoading"
          :onClick="props.onDelete"
          class="border bg-primary-foreground text-primary-foreground-text hover:bg-primary/30"
        >
          <Icon icon="icon-park-outline:delete" />
        </Button>

        <slot name="Post"></slot>
      </div>
    </div>
  </div>
</template>
