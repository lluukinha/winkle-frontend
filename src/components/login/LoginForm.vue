<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import LoginRepository from "../../repositories/login/LoginRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import { AxiosError } from "axios";
import { showError } from "../../scripts/NotificationScript";
import i18n from "../../scripts/internacionalization/i18n";
import { ILoginForm } from "../../repositories/login/ILoginForm";
import showErrorMessage from "../../scripts/ErrorLogs";
import EyeIcon from "../icons/EyeIcon.vue";

const emit = defineEmits(['loginFinished', 'forgot']);
const { t } = i18n.element.global;
const firstInput : Ref<HTMLElement | undefined> = ref();
const loginForm: Ref<ILoginForm> = ref({ email: '', password: '' });
const isShowingPassword : Ref<boolean> = ref(false);

const doLogin = (e: Event) => {
  e.preventDefault();

  WinkleScripts.setLoading(true);
  LoginRepository.doLogin(loginForm.value)
    .then(() => { emit('loginFinished'); })
    .catch((e: AxiosError) => {
      const unauthorizedError = 'Unauthorized';
      const isUnauthorized = e.response?.statusText === unauthorizedError
        || e.response?.data.error === unauthorizedError;
      const failed : boolean = e.response?.status === 401 && isUnauthorized;
      if (failed) showError(t('login.login-failed'), t('login.user-not-found'));
      if (!failed) showErrorMessage(e);
      clearform();
    })
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const clearform = () => {
  // loginForm.value.email = ''; -> Request from user, do not clear the email, just the password
  loginForm.value.password = '';
  firstInput.value?.focus();
};

onMounted(() => { firstInput.value?.focus(); });
</script>

<template>
  <form @submit="doLogin">
    <div class="text-left">
      <div class="text-sm font-bold text-gray-700 dark:text-gray-100 tracking-wide">
        {{ $t('login.email') }}
      </div>
      <input
        ref="firstInput"
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="email"
        placeholder="lucas@winkle.com.br"
        v-model="loginForm.email"
        required
      />
    </div>

    <div class="mt-8">
      <div class="flex justify-between items-center">
        <div class="text-sm font-bold text-gray-700 dark:text-gray-100 tracking-wide">
          {{ $t('login.password') }}
        </div>
        <div>
          <span
            @click="$emit('forgot')"
            class="
              text-xs
              font-display font-semibold
              text-gray-600 hover:text-gray-800
              dark:text-gray-300 dark:hover:text-gray-100
              cursor-pointer
            "
          >
            {{ $t('login.forgot-password') }}
          </span>
        </div>
      </div>
      <div class="w-full flex">
        <input
          class="
            w-full text-lg p-2
            border-b border-gray-300 bg-gray-100
            focus:outline-none focus:border-gray-200
            rounded rounded-tr-none rounded-br-none
          "
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('login.password-placeholder')"
          v-model="loginForm.password"
          required
        />
        <span
          class="span-button bg-gray-200 hover:bg-gray-300 flex items-center p-2 rounded-tr rounded-br"
          @click="isShowingPassword = !isShowingPassword"
          :title="$t('passwords.form.show-password')"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </span>
      </div>
    </div>
    <div class="mt-10">
      <button
        class="
          bg-gray-600 hover:bg-gray-700 text-gray-100
          p-4
          w-full
          rounded-full
          tracking-wide
          font-semibold font-display
          focus:outline-none focus:shadow-outline
          shadow-lg
        "
      >
        {{ $t('login.enter') }}
      </button>
    </div>
  </form>
</template>
