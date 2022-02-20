<script setup lang="ts">
import { onBeforeMount, Ref, ref } from "vue";
import LoginScreen from "../components/login/LoginScreen.vue";
import LoginRepository from "../repositories/login/LoginRepository";
import router from "../router";
import MasterPassword from "../components/login/MasterPassword.vue";
import LoginForm from "../components/login/LoginForm.vue";
import ForgotPasswordForm from "../components/login/ForgotPasswordForm.vue";

const forgotPassword: Ref<boolean> = ref(false);
const loggedIn: Ref<boolean> = ref(false);
const emit = defineEmits(["loginFinished"]);

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
    :title="!forgotPassword ? $t('login.login') : $t('login.forgot-password')"
    v-if="!loggedIn"
    @loginFinished="loggedIn = true"
  >
    <Transition name="slide-left">
      <LoginForm
        v-if="!forgotPassword"
        @loginFinished="emit('loginFinished')"
        @forgot="forgotPassword = true"
      />
      <ForgotPasswordForm
        @goBack="forgotPassword = false"
        v-else
      />
    </Transition>
  </LoginScreen>
  <MasterPassword
    v-if="loggedIn"
    @failed="loggedIn = false"
  />
</template>

<style scoped>
</style>