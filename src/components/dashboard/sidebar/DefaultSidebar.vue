<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";

import SidebarIcon from "./SidebarIcon.vue";

defineProps<{ items: ISidebarItem[], userLogin: string }>();
const isOpen = ref(true);
const currentRoute = computed(() => router.currentRoute.value.name);
const topEl : Ref<HTMLElement | null> = ref(null);
const userEl : Ref<HTMLElement | null> = ref(null);
const footerEl : Ref<HTMLElement | null> = ref(null);

const menuHeight = computed(() => {
  const topHeight = topEl.value?.clientHeight || 0;
  const userHeight = userEl.value?.clientHeight || 0;
  const footerHeight = footerEl.value?.clientHeight || 0;
  return topHeight  + userHeight + footerHeight + 100;
});
</script>

<template>
  <!-- Sidebar starts -->
  <div
    class="w-80 bg-gray-800 shadow h-screen absolute hidden sm:relative sm:flex sm:flex-col sm:justify-between"
  >
    <div>
      <div ref="topEl" class="flex items-center justify-center flex-shrink-0 text-white mr-6 pt-8 mb-6">
        <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <div class="flex flex-col items-start">
          <span class="font-semibold text-xl tracking-tight">Winkle</span>
        </div>
      </div>
      <div ref="userEl" class="flex justify-center flex-col items-center">
        <div class="mb-4 rounded-full bg-white w-20 h-20 flex items-center justify-center text-3xl">LS</div>
        <span
          class="font-extralight text-sm text-gray-400 truncate w-64"
          :title="userLogin"
        >{{ userLogin }}</span>
      </div>
      <ul
        class="mt-10 overflow-auto px-4"
        :style="{ height: `calc(100vh - (${menuHeight}px))` }"
      >
        <router-link
          tag="li"
          :to="{ name: !item.disabled ? item.route : currentRoute }"
          class="flex justify-between items-center w-full mb-2 rounded-md py-2 px-6"
          :class="{
            'bg-gray-700': currentRoute === item.route,
            'cursor-pointer text-gray-300 hover:bg-gray-600': !item.disabled,
            'cursor-not-allowed text-gray-500': item.disabled,
          }"
          v-for="item in items"
          :key="item.name"
        >
          <div class="flex items-center focus:outline-none">
            <SidebarIcon :icon="item.icon" />
            <span class="text-sm ml-2">{{ item.name }}</span>
          </div>
        </router-link>
      </ul>
    </div>
    <div ref="footerEl" class="p-4 border-t border-gray-700">
      <ul>
        <router-link
          tag="li"
          :to="{ name: 'logout' }"
          class="flex justify-between items-center w-full cursor-pointer mb-2 text-gray-300 hover:bg-gray-700 rounded-md py-2 px-6"
        >
          <div class="flex items-center focus:outline-none" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span class="text-sm ml-2">{{ $t('logout') }}</span>
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>