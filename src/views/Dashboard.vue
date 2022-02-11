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
  <NavBar class="fixed w-full z-50 md:hidden" />
  <div class="w-screen bg-gray-400 flex justify-center">
  <div class="container flex justify-center">
    <Sidebar v-if="isLoaded" />
    <div class="p-10 bg-gray-50 h-screen pt-28 md:pt-10 w-full">
      <router-view></router-view>
    </div>
  </div>
  </div>
</template>