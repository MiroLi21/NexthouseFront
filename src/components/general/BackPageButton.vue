<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
 
 const router = useRouter();
 const onBack = () => {
  router.back();
 }
</script>
<template>
  <button
    @click="onBack"
    class="rounded-full cursor-pointer p-2 hover:bg-zinc-100 active:scale-95 transition"
    aria-label="Back"
  >
    <Icon icon="material-symbols:arrow-back" class="text-2xl" />
  </button>
</template>
