<script setup lang="ts">
import { ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";

defineProps<{ items: ISidebarItem[] }>()
const isOpen = ref(true);
</script>

<template>
  <button
    aria-label="Close sidebar"
    :class="{ 'ml-64': isOpen }"
    class="
      md:hidden
      h-10
      w-10
      bg-gray-800
      absolute
      mt-16
      flex
      items-center
      shadow
      rounded-tr rounded-br
      justify-center
      cursor-pointer
      text-white
    "
    @click="isOpen = !isOpen"
  >
    <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" v-else>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
  <div
    :class="{ hidden: !isOpen }"
    class="
      w-64
      z-40
      absolute
      bg-gray-800
      shadow
      h-screen
      flex-col
      justify-between
      sm:hidden
      transition
      duration-150
      ease-in-out
      flex
    "
  >
    <div class="px-8">
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
    <div class="px-8 border-t border-gray-700">
      <ul class="w-full flex items-center justify-between bg-gray-800">
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="show notifications"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg3.svg"
              alt="notifications"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open chats"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg4.svg"
              alt="chat"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open settings"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg5.svg"
              alt="settings"
            />
          </button>
        </li>
        <li class="cursor-pointer text-white pt-5 pb-3">
          <button
            aria-label="open logs"
            class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
          >
            <img
              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/light_with_icons_at_bottom-svg6.svg"
              alt="drawer"
            />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>