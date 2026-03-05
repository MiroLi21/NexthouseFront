<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from "reka-ui";
import { SelectRoot, useForwardPropsEmits } from "reka-ui";
import Label from "../label/Label.vue";

interface Props extends SelectRootProps {
  label?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<SelectRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SelectRoot data-slot="select" v-bind="forwarded">
    <Label v-if="props.label" class="mb-1">
      {{ props.label }}
    </Label>
    <slot />
  </SelectRoot>
</template>
