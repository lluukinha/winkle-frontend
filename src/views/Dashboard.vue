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
  <div class="flex flex-no-wrap">
    <Sidebar />
    <!-- Remove class [ h-64 ] when adding a card block -->
    <div class="container mx-auto py-10 h-64 md:w-4/5 w-11/12 px-6">
      <!-- Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border -->
      <div class="w-full h-full rounded border-dashed border-2 border-gray-300">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>