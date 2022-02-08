<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
import { onMounted } from "@vue/runtime-core";

const logout = async () => {
  LoginRepository.removeLoginInfo();
  router.push({ name: 'login' });
};

onMounted(() => { logout(); });
</script>

<template>
  <div>Loading...</div>
</template>