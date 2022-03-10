<script setup lang="ts">
const currentIndex = Math.floor(Math.random() * (2 - 0 + 1) + 0);
</script>

<template>
  <img
    src="../../assets/man1.png"
    class="w-full mx-auto scale-150"
    v-if="currentIndex === 0"
  />
  <img
    src="../../assets/man2.png"
    class="w-full mx-auto scale-150"
    v-if="currentIndex === 1"
  />
  <img
    src="../../assets/woman.png"
    class="w-full mx-auto scale-150"
    v-if="currentIndex === 2"
  />
</template>