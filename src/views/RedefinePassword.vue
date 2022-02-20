<script setup lang="ts">
import { onMounted } from '@vue/runtime-core';
import router from '../router';
import LoginScreen from '../components/login/LoginScreen.vue';
import ResetPasswordForm from '../components/login/ResetPasswordForm.vue';
</script>

<template>
  <LoginScreen
    :title="$t('reset-password.form.submit')"
    v-if="$route.params.email && $route.params.token"
  >
    <ResetPasswordForm
      :email="$route.params.email"
      :token="$route.params.token"
      @reset="router.push({ name: 'login' })"
    />
  </LoginScreen>
</template>
