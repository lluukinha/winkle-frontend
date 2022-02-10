<script setup lang="ts">
import { ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";

defineProps<{ items: ISidebarItem[], userLogin: string, isOpen: boolean }>()
</script>

<template>
  <div
    :class="{ 'w-0': !isOpen, 'w-64': isOpen }"
    class="
      transition-all
      duration-150
      z-40
      absolute
      bg-gray-800
      shadow
      h-screen
      flex-col
      justify-between
      sm:hidden
      flex
    "
  >
    <div class="px-8" v-if="isOpen">
      <div class="flex items-center flex-shrink-0 text-white mr-6 mt-8">
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
      <ul class="mt-12">
        <li
          class="flex w-full justify-between text-gray-300 hover:text-gray-500 cursor-pointer items-center mb-6"
          v-for="item in items"
          :key="item.name"
        >
          <a class="flex items-center focus:outline-none focus:ring-2 focus:ring-white">
            <SidebarIcon :icon="item.icon" />
            <span class="text-sm ml-2">{{ item.name }}</span>
          </a>
          <div class="py-1 px-3 bg-gray-600 rounded text-gray-300 flex items-center justify-center text-xs">
            5
          </div>
        </li>
      </ul>
    </div>
    <div class="py-4 px-8 border-t border-gray-700" v-if="isOpen">
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