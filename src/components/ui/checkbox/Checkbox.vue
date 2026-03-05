<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { Check } from "lucide-vue-next";
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<
  CheckboxRootProps & {
    class?: HTMLAttributes["class"];
    label?: string;
  }
>();

const emits = defineEmits<CheckboxRootEmits>();

const delegatedProps = reactiveOmit(props, "class");

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <div class="flex items-start justify-center w-full gap-2">
    <!-- Checkbox box -->
    <CheckboxRoot
      data-slot="checkbox"
      v-bind="forwarded"
      :class="
        cn(
          'peer items-center mt-1 border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
          props.class
        )
      "
    >
      <CheckboxIndicator
        data-slot="checkbox-indicator"
        class="flex items-center justify-center text-current transition-none"
      >
        <slot>
          <Check class="size-3.5" />
        </slot>
      </CheckboxIndicator>
    </CheckboxRoot>

    <!-- Label text -->
    <label
      :for="props.id"
      class="w-full text-sm leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {{ props.label }}
    </label>
  </div>
</template>
