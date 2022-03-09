<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
import Sidebar from "../components/dashboard/Sidebar.vue";
import { onMounted, Ref, ref } from "@vue/runtime-core";
import MasterPassword from "../components/login/MasterPassword.vue";

const isLoaded: Ref<boolean> = ref(false);

onMounted(async () => {
  if (!LoginRepository.canUseLoginInfo()) {
    router.push({ name: 'logout' });
    return;
  }

  if (router.currentRoute.value.name === 'dashboard') router.push({ name: 'dashboard-passwords' });
  isLoaded.value = true;
});
</script>

<template>
  <MasterPassword
    v-if="isLoaded && !LoginRepository.masterPassword.value"
  />
  <div class="w-screen bg-gray-400 dark:bg-gray-600 flex justify-center" v-else>
    <div class="w-full flex flex-col items-center">
      <div class="w-full flex justify-center">
        <Sidebar v-if="isLoaded" />
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