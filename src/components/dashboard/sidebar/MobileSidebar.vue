<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import SidebarIcon from "./SidebarIcon.vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";
import SidebarScript from "../../../scripts/SidebarScript";
import InitialsSquare from "../../shared/InitialsSquare.vue";
import LoginRepository from "../../../repositories/login/LoginRepository";

const props = defineProps<{ items: ISidebarItem[], userLogin: string, userName: string, isOpen: boolean }>();
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

      <div
        class="flex px-8 items-center py-4"
        @click="changeRoute('dashboard-user')"
      >
        <InitialsSquare
          :text="userName"
          size="sm"
          class="cursor-pointer mr-4"
        />
        <div
          class="
            text-gray-300 hover:text-gray-100 text-left cursor-pointer hover:underline
            flex flex-col justify-center -mt-2
          "
        >
          <span class="text-xl break-all flex items-center">
            {{ userName }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </span>
          <span class="italic font-thin text-xs break-all">{{ userLogin }}</span>
        </div>
      </div>

      <hr class="border-gray-700">

      <ul class="">
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
            <span class="text-lg ml-2">{{ item.name }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="py-2 border-t border-gray-700" v-if="isOpen">
      <ul>
        <li class="flex justify-between items-center w-full cursor-pointer mb-2 text-gray-300 hover:bg-gray-700 rounded-md py-2 px-8">
          <div
            class="flex items-center focus:outline-none"
            @click="LoginRepository.removeMasterPassword()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm ml-2">{{ $t('logout') }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>