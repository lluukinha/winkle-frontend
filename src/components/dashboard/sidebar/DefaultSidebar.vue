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
        <span class="font-semibold text-xl tracking-tight">Winkle</span>
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
      <ul class="mr-2">
        <li
          class="
            w-full
            cursor-pointer
            flex flex-col
            items-end
            text-gray-200
          "
        >
          <span class="text-sm">{{ userLogin }}</span>
          <router-link
            class="text-xs text-gray-400 hover:text-gray-200 cursor-pointer"
            :to="{ name: 'logout' }"
          >
            {{ $t('logout') }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>