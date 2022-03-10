<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
import Sidebar from "../components/dashboard/Sidebar.vue";
import { onBeforeMount, Ref, ref } from "@vue/runtime-core";
import MasterPassword from "../components/login/MasterPassword.vue";

const isLoaded: Ref<boolean> = ref(false);

onBeforeMount(() => {
  if (LoginRepository.checkLoginTimeout()) {
    router.push({ name: 'logout' });
    return;
  }

  if (!LoginRepository.isRefreshed.value) LoginRepository.refreshUser();

  if (router.currentRoute.value.name === 'dashboard') {
    isLoaded.value = true;
    router.push({ name: 'dashboard-passwords' });
    return;
  }

  isLoaded.value = true;
})
</script>

<template>
  <MasterPassword v-if="isLoaded && !LoginRepository.masterPassword.value" />
  <div class="w-screen h-screen bg-gray-400 dark:bg-gray-600 flex justify-center" v-else>
    <div class="w-full flex flex-col items-center" v-if="isLoaded && LoginRepository.isRefreshed.value">
      <div class="w-full flex justify-center">
        <Sidebar />
        <div
          class="
            bg-gray-300 dark:bg-gray-700 dark:text-gray-400
            w-full h-screen md:h-auto
            overflow-auto md:overflow-hidden
          "
        >
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>