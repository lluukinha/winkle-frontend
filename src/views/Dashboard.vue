<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";

import Sidebar from "../components/dashboard/Sidebar.vue";
import NavBar from "../components/NavBar.vue";
import { onMounted, ref } from "@vue/runtime-core";

const isLoaded = ref(false);

onMounted(() => {
  if (!LoginRepository.canUseLoginInfo) router.push({ name: 'login' });
  if (router.currentRoute.value.name === 'dashboard') router.push({ name: 'dashboard-passwords' });
  isLoaded.value = true;
});
</script>

<template>
  <div class="w-screen bg-gray-400 flex justify-center">
    <div class="w-full flex flex-col items-center">
      <NavBar class="z-50 w-full sm:hidden" />
      <div class="w-full flex justify-center">
        <Sidebar v-if="isLoaded" />
        <div class="bg-gray-50 h-screen w-full pt-4">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>