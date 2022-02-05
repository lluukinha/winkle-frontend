<script setup lang="ts">
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";


const logout = async () => {
  LoginRepository.removeLoginInfo();
  router.push("/login");
};

logout();
</script>

<template>
  <div>Loading...</div>
</template>