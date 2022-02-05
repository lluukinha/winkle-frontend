<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
import PasswordRepository from "../repositories/passwords/PasswordRepository";

import Sidebar from "../components/dashboard/Sidebar.vue";

if (router.currentRoute.value.name === 'dashboard') router.push({ name: 'dashboard-passwords' });

const passwords = ref([]);

const mount = () : void => {
  if (!LoginRepository.canUseLoginInfo) {
    router.push("/login");
    return;
  }

  getPasswords();
};

const getPasswords = () => {
  PasswordRepository.getPasswords()
    .then(({ data }) => {
      console.log(data);
      passwords.value = data;
    })
    .catch((errors) => { console.log(errors); });
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
        <div>Welcome to Dashboard</div>
        {{ passwords }}
      </div>
    </div>
  </div>
</template>