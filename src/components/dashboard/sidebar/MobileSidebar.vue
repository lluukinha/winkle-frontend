<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";
import SidebarScript from "../../../scripts/SidebarScript";
import WinkleScripts from "../../../scripts/WinkleScripts";
import InitialsSquare from "../../shared/InitialsSquare.vue";

const props = defineProps<{ items: ISidebarItem[], userLogin: string, userName: string, isOpen: boolean }>();
const currentRoute = computed(() => router.currentRoute.value.name);
const changeRoute = (newRoute: string) : void => {
  SidebarScript.toggleSidebar(false);
  router.push({ name: newRoute });
};

const topEl: Ref<HTMLElement | null> = ref(null);
const userEl: Ref<HTMLElement | null> = ref(null);
const footerEl: Ref<HTMLElement | null> = ref(null);

const menuHeight = computed(() => {
  const userHeight = userEl.value?.clientHeight || 0;
  const footerHeight = footerEl.value?.clientHeight || 0;
  const calc = userHeight + footerHeight + 100;
  return { height: `calc(100vh - ${calc}px)` };
});
</script>

<template>
  <div
    :class="`
      ${isOpen ? 'w-screen' : 'w-0' }
      h-screen
      transition-all
      duration-150
      z-40
      bg-gray-800
      shadow
      flex-col
      justify-between
      sm:hidden
      flex
      fixed left-0
      `
    "
  >
    <div class="px-8" v-if="isOpen">
      <div ref="topEl" class="flex items-center justify-center flex-shrink-0 text-white mr-6 pt-6">
        <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <div class="flex flex-col items-start">
          <span class="text-xl">Winkle</span>
        </div>
      </div>

      <div
        ref="userEl"
        class="flex justify-center flex-col items-center pt-10"
      >
        <InitialsSquare :text="userName" class="mb-4" />
        <div
          class="
            flex justify-center w-56
            font-extralight text-sm text-gray-400
            select-none
            hover:text-gray-100 cursor-pointer
          "
          @click="changeRoute('dashboard-user')"
        >
          <span class="truncate mr-2" :title="userLogin">
            {{ userLogin }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>

      <ul class="mt-8 overflow-y-auto" :style="menuHeight">
        <li
          class="flex justify-between items-center w-full mb-2 rounded-md py-2 px-6"
          v-for="item in items"
          :key="item.name"
          :class="{
            'bg-gray-700': currentRoute === item.route,
            'cursor-pointer text-gray-300 hover:bg-gray-600': !item.disabled,
            'cursor-not-allowed text-gray-500': item.disabled,
          }"
          @click="!item.disabled ? changeRoute(item.route) : ''"
        >
          <div class="flex items-center focus:outline-none">
            <SidebarIcon :icon="item.icon" />
            <span class="text-sm ml-2">{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div ref="footerEl" class="py-4 px-8 border-t border-gray-700" v-if="isOpen">
      <ul>
        <li class="flex justify-between items-center w-full cursor-pointer mb-2 text-gray-300 hover:bg-gray-700 rounded-md py-2 px-6">
          <router-link class="flex items-center focus:outline-none" :to="{ name: 'logout' }">
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