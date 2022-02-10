<script setup lang="ts">
import { ref } from "vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";

import SidebarIcon from "./SidebarIcon.vue";

defineProps<{ items: ISidebarItem[], userLogin: string }>();
const isOpen = ref(true);
const currentRoute = router.currentRoute.value.name;
const checkRoute = (route: string): boolean => route === currentRoute;
</script>

<template>
  <!-- Sidebar starts -->
  <div
    class="
      w-64
      absolute
      sm:relative
      bg-gray-800
      shadow
      h-screen
      justify-between
      hidden sm:flex sm:flex-col
    "
  >
    <div class="px-8">
      <div class="flex items-center flex-shrink-0 text-white mr-6 pt-8">
        <svg
          class="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
          />
        </svg>
        <div class="flex flex-col items-start">
          <span class="font-semibold text-xl tracking-tight">Winkle</span>
          <span
            class="text-left font-extralight text-xs text-gray-400 w-32 truncate"
            :title="userLogin"
          >
            {{ userLogin }}
          </span>
        </div>
      </div>
      <ul class="mt-10">
        <li
          class="flex w-full justify-between cursor-pointer items-center mb-6"
          :class="{
            'text-gray-200': checkRoute(item.route) && !item.disabled,
            'text-gray-400': !checkRoute(item.route) && !item.disabled,
            'hover:text-gray-200': !checkRoute(item.route) && !item.disabled,
            'text-gray-600': item.disabled,
            'cursor-not-allowed': item.disabled,
          }"
          v-for="item in items"
          :key="item.name"
        >
          <router-link
            class="flex items-center focus:outline-none"
            :to="{ name: !item.disabled ? item.route : currentRoute }"
          >
            <SidebarIcon :icon="item.icon" />
            <span class="text-sm ml-2">{{ item.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="py-4 px-6 border-t border-gray-700">
      <ul>
        <li
          class="flex w-full justify-between cursor-pointer items-center text-gray-400 hover:text-gray-200"
        >
          <router-link
            class="flex items-center focus:outline-none"
            :to="{ name: 'logout' }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm ml-2">{{ $t('logout') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>