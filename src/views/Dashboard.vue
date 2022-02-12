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
      <NavBar class="w-full md:hidden" />
      <div class="container flex justify-center">
        <Sidebar v-if="isLoaded" />
        <div class="bg-gray-50 h-screen py-6 md:py-10 w-full container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>