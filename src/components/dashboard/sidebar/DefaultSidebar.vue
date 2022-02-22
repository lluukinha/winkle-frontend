<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";

import SidebarIcon from "./SidebarIcon.vue";
import InitialsSquare from "../../shared/InitialsSquare.vue";
import { ILoginInfo } from "../../../repositories/login/ILoginInfo";
import LoginRepository from "../../../repositories/login/LoginRepository";

const props = defineProps<{ items: ISidebarItem[], userLogin: string, userName: string }>();
const isOpen: Ref<boolean> = ref(true);
const currentRoute = computed(() => router.currentRoute.value.name);
const userData: Ref<ILoginInfo | null> = ref(null);

onMounted(() => {
  userData.value = LoginRepository.loginData();
});
</script>

<template>
  <div
    class="
      w-80 h-screen bg-gradient-to-bl from-gray-700 to-gray-900 border-r
      shadow absolute hidden
      sm:relative sm:flex sm:flex-col sm:justify-between
    "
  >
    <div>
      <div class="flex items-center justify-center pt-4 mb-6">
        <img src="../../../assets/logo-white.png" class="px-14 w-full" />
      </div>
      <div class="flex px-4 items-center">
        <InitialsSquare
          :text="userName"
          size="sm"
          class="cursor-pointer mr-4"
          @click="$router.push({ name: 'dashboard-user' })"
        />
        <router-link
          tag="div"
          class="
            text-gray-300 hover:text-gray-100 text-left cursor-pointer hover:underline
            flex flex-col justify-center -mt-1
          "
          v-if="userData"
          :to="{ name: 'dashboard-user' }"
        >
          <span class="text-lg break-all flex items-center">
            {{ userName }}
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </span>
          <span class="italic font-thin text-xs break-all">{{ userLogin }}aaaaa</span>
        </router-link>
      </div>
      <!-- div class="flex justify-center flex-col items-center">
        <InitialsSquare
          :text="userName"
          class="mb-4 cursor-pointer"
          @click="$router.push({ name: 'dashboard-user' })"
        />
        <router-link
          tag="div"
          class="
            flex justify-center w-56
            font-extralight text-sm text-gray-400
            select-none
            hover:text-gray-100 cursor-pointer
          "
          :to="{ name: 'dashboard-user' }"
        >
          <span class="truncate mr-2" :title="userLogin">
            {{ userLogin }}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </router-link>
      </div -->
      <ul class="mt-10 px-4">
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
    <div class="p-4 border-t border-gray-700">
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