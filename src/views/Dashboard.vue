<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";

import Sidebar from "../components/dashboard/Sidebar.vue";

const mount = () : void => {
  if (!LoginRepository.canUseLoginInfo) {
    router.push("/login");
    return;
  }

  if (router.currentRoute.value.name === 'dashboard') router.push({ name: 'dashboard-passwords' });
};

mount();
</script>

<template>
  <div class="flex flex-no-wrap bg-gray-100">
    <Sidebar />
    <!-- Remove class [ h-64 ] when adding a card block -->
    <div class="container mx-auto py-10 md:w-4/5 w-full h-screen px-6 overflow-auto">
      <router-view></router-view>
    </div>
  </div>
</template>