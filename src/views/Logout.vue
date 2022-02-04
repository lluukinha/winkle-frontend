<script setup lang="ts">
import router from "../router";
import axios from "axios";
import LoginRepository from "../repositories/login/LoginRepository";


const logout = async () => {
  await LoginRepository.doLogout()
    .then(() => { router.push("/login"); })
    .catch((error) => {
      console.log(error);
      LoginRepository.removeLoginInfo();
      router.push("/login");
    });
};

logout();
</script>

<template>
  <div>Loading...</div>
</template>