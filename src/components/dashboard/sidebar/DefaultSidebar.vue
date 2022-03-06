<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import { ISidebarItem } from "./ISidebarItem";
import router from "../../../router";

import SidebarIcon from "./SidebarIcon.vue";
import { ILoginInfo } from "../../../repositories/login/ILoginInfo";
import LoginRepository from "../../../repositories/login/LoginRepository";
import ImportPasswordsModal from "../../password/ImportPasswords/ImportPasswordsModal.vue";

const props = defineProps<{ items: ISidebarItem[] }>();
const isOpen: Ref<boolean> = ref(true);
const currentRoute = computed(() => router.currentRoute.value.name);
const userData: Ref<ILoginInfo | null> = ref(null);
const isImportingPasswords: Ref<boolean> = ref(false);

onMounted(() => {
  userData.value = LoginRepository.loginData();
});
</script>

<template>
  <div
    class="
      w-80 h-screen bg-gradient-to-bl from-gray-800 to-gray-900 border-r
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

      <hr class=" border-gray-700">

      <ul class="mt-4 px-4">
        <li
          class="justify-between items-center w-full cursor-pointer mb-2 text-gray-300 hover:bg-gray-700 rounded-md py-2 px-6 hidden"
          @click="isImportingPasswords = !isImportingPasswords"
        >
          <div class="flex items-center focus:outline-none" >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm ml-2">{{ $t('passwords.import.title') }}</span>
          </div>
        </li>
        <ImportPasswordsModal
          :folders="[]"
          v-if="isImportingPasswords"
          @close="isImportingPasswords = false"
          @save="() => {}"
        />
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
        <li
          class="flex justify-between items-center w-full cursor-pointer mb-2 text-gray-300 hover:bg-gray-700 rounded-md py-2 px-6"
          @click="LoginRepository.removeMasterPassword()"
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
        </li>
      </ul>
    </div>
  </div>
</template>