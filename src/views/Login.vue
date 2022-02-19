<script setup lang="ts">
import { onBeforeMount, Ref, ref } from "vue";
import LoginScreen from "../components/login/LoginScreen.vue";
import LoginRepository from "../repositories/login/LoginRepository";
import router from "../router";
import MasterPassword from "../components/login/MasterPassword.vue";

const loggedIn: Ref<boolean> = ref(false);

onBeforeMount(() => {
  const masterPass = LoginRepository.getMasterPassword();
  if (LoginRepository.canUseLoginInfo()) {
    if (masterPass != null) router.push({ name: 'dashboard' });
    if (masterPass == null) loggedIn.value = true;
  }
});
</script>

<template>
  <LoginScreen
    v-if="!loggedIn"
    @loginFinished="loggedIn = true"
  />
  <MasterPassword
    v-if="loggedIn"
    @failed="loggedIn = false"
  />
</template>

<style scoped>
</style>