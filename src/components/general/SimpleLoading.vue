<script setup lang="ts">
const colors = ['#4f46e5', '#6366f1', '#818cf8'] // Indigo shades
</script>

<template>
  <div class="flex justify-center items-center">
    <div class="flex space-x-2">
      <div v-for="(color, index) in colors" 
           :key="index"
           class="w-3 h-3 rounded-full loading-dot"
           :style="{
             backgroundColor: color,
             animationDelay: `${index * 0.15}s`
           }">
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes loading {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.loading-dot {
  animation: loading 1s ease-in-out infinite;
}
</style>
