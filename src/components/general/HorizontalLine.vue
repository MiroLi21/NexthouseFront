<script setup lang="ts">
defineProps({
  margin: {
    type: [String, Number],
    default: "3",
  },
});
</script>

<template>
  <div
    :class="[
      'w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm',
      `my-${margin}`,
    ]"
  ></div>
</template>
