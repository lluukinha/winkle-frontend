<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";
import SidebarScript from "../../../scripts/SidebarScript";

defineProps<{ items: ISidebarItem[], userLogin: string, isOpen: boolean }>();
const currentRoute = computed(() => router.currentRoute.value.name);
const changeRoute = (newRoute: string) : void => {
  SidebarScript.toggleSidebar(false);
  router.push({ name: newRoute });
};

const topEl : Ref<HTMLElement | null> = ref(null);
const userEl : Ref<HTMLElement | null> = ref(null);
const footerEl : Ref<HTMLElement | null> = ref(null);

const menuHeight = computed(() => {
  const topHeight = topEl.value?.clientHeight || 0;
  const userHeight = userEl.value?.clientHeight || 0;
  const footerHeight = footerEl.value?.clientHeight || 0;
  return topHeight  + userHeight + footerHeight + 150;
});
</script>

<template>
  <div
    :class="{ 'w-0': !isOpen, 'w-screen': isOpen }"
    class="
      transition-all
      duration-100
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
      <div ref="topEl" class="mt-24"></div>

      <div ref="userEl" class="flex justify-center flex-col items-center">
        <div class="mb-4 rounded-full bg-white w-20 h-20 flex items-center justify-center text-3xl">LS</div>
        <span
          class="font-extralight text-sm text-gray-400 w-32 truncate"
          :title="userLogin"
        >{{ userLogin }}</span>
      </div>

      <ul
        class="mt-8 overflow-y-auto"
        :style="{ height: `calc(100vh - (${menuHeight}px))` }"
      >
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