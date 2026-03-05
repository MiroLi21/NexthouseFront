<script setup lang="ts">
import { t } from "@/utilities/I18nPlugin";
import Button from "../ui/button/Button.vue";
const props = defineProps({
  getDataButton: {
    type: Function,
    required: true,
  },
});
</script>
<template>
  <div class="w-full flex">
    <div class="1/2 flex">
      <div class="flex gap-3 items-center">
        <slot></slot>
        <Button
          color="green"
          type="outlined"
          :text="t('Search')"
          preIcon="magnify"
          :onClick="props.getDataButton"
          class="mt-3"
          width="25"
        />
      </div>
    </div>
    <div class="1/2 flex items-center">
      <slot name="AfterButton"></slot>
    </div>
  </div>
</template>
