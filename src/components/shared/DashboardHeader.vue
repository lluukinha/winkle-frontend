<script setup lang="ts">
import { ref, watch } from "vue";
defineProps<{ title: string }>();
const emit = defineEmits(['search']);

const filter = ref('');

watch(filter, (currentValue) => { emit('search', currentValue); });
</script>

<template>
  <div class="border-b border-gray-300 px-8 py-4 bg-gray-200">
    <div class="header-top flex justify-between mb-2">
      <h1 class="text-2xl font-bold">{{ title }}</h1>
      <div class="flex border-b items-center ml-10 bg-gray-100 rounded-lg px-4 shadow">
        <label for="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
        <input
          id="search-input"
          type="text"
          class="
            ml-4
            bg-gray-50
            border border-none border-b-2
            focus:border-none
            w-24
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