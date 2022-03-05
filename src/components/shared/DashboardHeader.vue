<script setup lang="ts">
import { ILoginInfo } from "../../repositories/login/ILoginInfo";
import LoginRepository from "../../repositories/login/LoginRepository";
import SidebarScript from "../../scripts/SidebarScript";
defineProps<{ title: string }>();

const loginData : ILoginInfo | null = LoginRepository.loginData();
const toggleSidebar = () => {
  SidebarScript.toggleSidebar(true);
};

</script>

<template>
  <div
    class="
      border-b border-gray-300
      px-4 md:px-8 py-4
      bg-gray-200 h-16
      absolute w-full md:static
      "
  >
    <div class="header-top flex justify-between items-center">
      <div class="w-1/2">
        <h1 class="text-xl md:text-2xl font-bold flex items-center">
          <button class="md:hidden bg-gray-200 rounded mr-2" @click="toggleSidebar()">
            <!-- list icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <!-- end list icon -->
          </button>
          {{ title }}
        </h1>
      </div>
      <div
        class="w-1/2 md:w-auto hover:underline cursor-pointer flex justify-end"
        v-if="loginData"
        @click="$router.push({ name: 'dashboard-user' })"
      >
        <span class="truncate">{{ loginData.user }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>