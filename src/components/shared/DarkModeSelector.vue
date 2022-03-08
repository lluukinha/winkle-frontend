<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
const isDarkModeEnabled: Ref<boolean> = ref(false);

const changeMode = () => {
  if (isDarkModeEnabled.value) {
    localStorage.theme = 'dark';
    document.documentElement.classList.add('dark');
  } else {
    localStorage.theme = 'light';
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  const theme = localStorage.getItem('theme');
  if (!theme || theme === 'light') isDarkModeEnabled.value = false;
  if (theme === 'dark') isDarkModeEnabled.value = true;
});
</script>

<template>
  <label for="darkMode" class="flex items-center cursor-pointer">
    <!-- toggle -->
    <div class="relative">
      <!-- input -->
      <input
        id="darkMode"
        type="checkbox"
        class="sr-only"
        v-model="isDarkModeEnabled"
        @change="changeMode"
      />
      <!-- line -->
      <div class="w-7 h-2 bg-gray-400 rounded-full shadow-inner"></div>
      <!-- dot -->
      <div
        class="
          dot absolute w-4 h-4
          bg-gray-300 rounded-full
          shadow -left-1 -top-1
          transition
        "
      ></div>
    </div>
    <!-- label -->
    <div class="ml-3">Dark mode</div>
  </label>
</template>

<style scoped>
/* Toggle A */
input:checked ~ .dot {
  transform: translateX(100%);
  background-color: #362b4c;
  border: 1px solid white;
}
</style>
