<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import SidebarScript from "../../scripts/SidebarScript";
defineProps<{ title: string, showSearchBox: boolean }>();
const emit = defineEmits(['search']);

const filter: Ref<string> = ref('');
const toggleSidebar = () => {
  SidebarScript.toggleSidebar(true);
};

watch(filter, (currentValue) => { emit('search', currentValue); });
</script>

<template>
  <div
    class="
      border-b border-gray-300
      px-4 md:px-8 py-4
      bg-gray-200 h-16
      absolute w-full md:static
      "
  >
    <div class="header-top flex justify-between">
      <div
        class="md:w-auto"
        :class="{ 'w-full': !showSearchBox, 'w-1/2': showSearchBox }"
      >
      <h1 class="text-lg sm:text-xl md:text-2xl font-bold flex items-center">
        <button class="md:hidden bg-gray-200 rounded mr-2" @click="toggleSidebar()">
          <!-- list icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <!-- end list icon -->
        </button>
        {{ title }}
      </h1>
      </div>
      <div
        class="w-1/2 md:w-auto flex border-b items-center bg-gray-100 rounded-lg px-2 shadow"
        v-if="showSearchBox"
      >
        <label for="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
        <input
          id="search-input"
          type="text"
          class="
            ml-4
            bg-gray-100
            border border-none border-b-2
            focus:border-none
            w-20 sm:w-24
            !outline-none
          "
          v-model="filter"
          :placeholder="$t('passwords.search')"
          autocomplete="off"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>