<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";
import SidebarIcon from "./SidebarIcon.vue";

const props = defineProps<{ items: ISidebarItem[] }>();
const isOpen: Ref<boolean> = ref(true);
const currentRoute = computed(() => router.currentRoute.value.name);
</script>

<template>
  <div
    class="
      w-80 h-screen
      bg-gradient-to-bl from-gray-800 to-gray-900
      border-r dark:border-gray-800
      shadow absolute hidden
      sm:relative sm:flex sm:flex-col sm:justify-between
    "
  >
    <div>
      <div class="py-3 px-4 flex items-center bg-gray-900 select-none">
        <div class="bg-gray-900 rounded shadow w-10 p-1 mr-2 border-gray-700 border">
          <img src="../../../assets/logo-white.png" class="h-auto w-36" />
        </div>
        <span class="text-gray-50 text-xl font-bold italic shadow-lg">Winkle</span>
      </div>

      <hr class="border-gray-700">

      <ul class="mt-4 px-4">
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
  </div>
</template>
