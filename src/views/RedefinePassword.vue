<script setup lang="ts">
import router from '../router';
import LoginScreen from '../components/login/LoginScreen.vue';
import ResetPasswordForm from '../components/login/ResetPasswordForm.vue';
</script>

<template>
  <LoginScreen :title="$t('reset-password.form.submit')">
    <ResetPasswordForm
      :email="$route.params.email.toString()"
      :token="$route.params.token.toString()"
      @reset="router.push({ name: 'login' })"
    />
  </LoginScreen>
</template>
