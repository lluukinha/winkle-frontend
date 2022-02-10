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
  <div class="flex flex-no-wrap bg-gray-100">
    <Sidebar v-if="isLoaded" />
    <!-- Remove class [ h-64 ] when adding a card block -->
    <div class="container mx-auto py-10 md:w-4/5 w-full h-screen px-6 overflow-auto mt-16 md:mt-0">
      <router-view></router-view>
    </div>
  </div>
</template>