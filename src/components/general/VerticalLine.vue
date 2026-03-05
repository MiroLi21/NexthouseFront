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
      'w-px h-full bg-gradient-to-r from-transparent via-gray-300 to-transparent shadow-sm',
      `mx-${margin}`,
    ]"
  ></div>
</template>
