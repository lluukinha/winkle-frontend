<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";
import SidebarScript from "../../../scripts/SidebarScript";

const props = defineProps<{ items: ISidebarItem[], isOpen: boolean }>();
const currentRoute = computed(() => router.currentRoute.value.name);
const changeRoute = (newRoute: string) : void => {
  SidebarScript.toggleSidebar(false);
  router.push({ name: newRoute });
};

</script>

<template>
  <div
    :class="`
      ${isOpen ? 'w-screen' : 'w-0' }
      h-screen
      transition-all
      duration-150
      z-50
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
    <div v-if="isOpen">
      <div
        class="py-4 px-8 bg-gray-900 text-left"
        @click="SidebarScript.toggleSidebar(false)"
      >
        <div class="flex items-center">
          <img
            src="../../../assets/logo-white.png"
            class="h-auto bg-gray-800 rounded shadow w-10 p-1 mr-3 border-gray-700 border"
          />
          <span class="text-gray-50 text-xl font-bold italic shadow-lg">
            Winkle
          </span>
        </div>
      </div>

      <hr class="border-gray-700">

      <ul>
        <li
          class="flex justify-between items-center w-full mb-2 py-4 px-8"
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
            <span class="text-lg ml-2">{{ $t(item.name) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>