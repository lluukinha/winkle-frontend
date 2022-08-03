<script setup lang="ts">
import { ref, Ref } from 'vue';
import LoginRepository from '../../repositories/login/LoginRepository';
import SidebarScript from '../../scripts/SidebarScript';
import DarkModeSelector from './DarkModeSelector.vue';
import LanguageSelector from './LanguageSelector.vue';

defineProps<{ title: string }>();

const isMenuOpen: Ref<boolean> = ref(false);
const toggleSidebar = () => {
  SidebarScript.toggleSidebar(true);
};
</script>

<template>
  <div
    class="border-b border-gray-300 dark:border-gray-700 px-4 md:px-8 py-4 h-16 bg-gray-200 dark:bg-gray-900 absolute w-full md:static dark:text-gray-100"
  >
    <div class="header-top flex justify-between items-center">
      <div class="w-1/2">
        <h1 class="text-xl md:text-2xl font-bold flex items-center">
          <button
            class="md:hidden bg-gray-200 dark:bg-gray-800 rounded mr-2"
            @click="toggleSidebar()"
          >
            <!-- list icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <!-- end list icon -->
          </button>
          {{ title }}
        </h1>
      </div>
      <div
        class="w-1/2 md:w-auto hover:underline cursor-pointer flex justify-end"
        v-if="LoginRepository.loginData.value"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="truncate w-20 md:w-24 text-right">
          {{ LoginRepository.loginData.value.user.split(' ')[0] }}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <!-- Dropdown menu -->
      <div
        v-if="isMenuOpen"
        @click="isMenuOpen = false"
        class="w-screen h-screen absolute bg-black opacity-20 inset-0 z-0"
      ></div>
      <div
        class="fixed z-50 p-2 top-10 right-10 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-800 dark:divide-gray-700"
        v-if="isMenuOpen"
      >
        <div class="py-3 px-4">
          <span class="block text-sm text-gray-900 dark:text-white">
            {{ LoginRepository.loginData.value?.user }}
          </span>
          <span
            class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
            >{{ LoginRepository.loginData.value?.login }}</span
          >
        </div>
        <div
          class="flex justify-center items-center p-2 text-gray-700 dark:text-gray-200 dark:hover:text-white cursor-pointer"
        >
          <LanguageSelector class="bg-white dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 dark:focus:text-white" />
        </div>
        <div
          class="flex justify-center items-center p-2 text-sm text-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
        >
          <DarkModeSelector />
        </div>
        <ul class="py-1" aria-labelledby="dropdown">
          <li
            @click="
              () => {
                isMenuOpen = false;
                $router.push({ name: 'dashboard-user' });
              }
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm ml-2">{{ $t('my-data') }}</span>
          </li>
          <li @click="LoginRepository.removeMasterPassword()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm ml-2">{{ $t('logout') }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
li {
  @apply flex justify-center items-center
          py-2 px-4 text-sm
          text-gray-700
          hover:bg-gray-300 dark:hover:bg-gray-600
          dark:text-gray-200
          dark:hover:text-white
          cursor-pointer;
}
</style>
