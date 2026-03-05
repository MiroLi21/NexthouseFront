<script setup lang="ts">
import { useI18n } from "@/stores/i18n/useI18n";
import { Icon } from "@iconify/vue";
const { t } = useI18n();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <fieldset
    class="border border-[#ccc] dark:border-gray-600 rounded-lg p-3 relative text-base"
    :class="{ [`w-full lg:w-${props.width}`]: props.width }"
    >
    <!-- :style="`border-radius: ${props.width === 'full' ? '0' : '8px'}`" -->
    <legend class="text-lg px-2 text--title text-left flex gap-1 items-center">
      <Icon v-if="props.icon != ''" :icon="props.icon" class="h-4.5 w-4.5" />
      {{ t(props.title) }}
    </legend>
    <div>
      <slot></slot>
    </div>
  </fieldset>
</template>
