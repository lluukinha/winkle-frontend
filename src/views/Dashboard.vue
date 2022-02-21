<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";

import Sidebar from "../components/dashboard/Sidebar.vue";
import { onBeforeMount, onMounted, Ref, ref } from "@vue/runtime-core";
import MasterPassword from "../components/login/MasterPassword.vue";

const isLoaded: Ref<boolean> = ref(false);

onBeforeMount(() => {
  const available = LoginRepository.canUseLoginInfo();
  if (!available) router.push({ name: 'logout' });
});

onMounted(() => {
  if (router.currentRoute.value.name === 'dashboard') router.push({ name: 'dashboard-passwords' });
  isLoaded.value = true;
});
</script>

<template>
  <MasterPassword v-if="!LoginRepository.isMasterPasswordInserted.value" />
  <div class="w-screen bg-gray-400 flex justify-center" v-else>
    <div class="w-full flex flex-col items-center">
      <div class="w-full flex justify-center">
        <Sidebar v-if="isLoaded" />
        <div class="bg-gray-300 h-screen w-full">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>