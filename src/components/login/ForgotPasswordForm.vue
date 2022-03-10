<script setup lang="ts">
import { AxiosError } from "axios";
import { onMounted, Ref, ref } from "vue";
import LoginRepository from "../../repositories/login/LoginRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import i18n from "../../scripts/internacionalization/i18n";
import { showSuccess } from "../../scripts/NotificationScript";
import WinkleScripts from "../../scripts/WinkleScripts";
import ResetPasswordForm from "./ResetPasswordForm.vue";

const { t } = i18n.element.global;
const email: Ref<string> = ref('');
const firstInput: Ref<HTMLElement | undefined> = ref();
const emailSent: Ref<boolean> = ref(false);

const rememberPassword = (e: Event) => {
  e.preventDefault();

  WinkleScripts.setLoading(true);
  LoginRepository.forgotPassword(email.value)
    .then(() => {
      showSuccess(
        t('reset-password.email-sent'),
        t('reset-password.email-sent-description'),
        5000
      );
      emailSent.value = true;
    })
    .catch((errors: AxiosError) => {
      showErrorMessage(errors);
      email.value = '';
      firstInput.value?.focus();
    })
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

defineEmits(['goBack']);

onMounted(() => { firstInput.value?.focus(); });
</script>

<template>
  <div>
    <form @submit="rememberPassword" v-if="!emailSent" autocomplete="off">
      <div class="text-left">
        <label
          for="email-input"
          class="text-sm font-bold text-gray-700 dark:text-gray-100 tracking-wide"
        >
          {{ $t('login.email') }}
        </label>
        <input
          id="email-input"
          ref="firstInput"
          class="
            w-full text-lg p-2
            border-b border-gray-300
            focus:outline-none focus:border-gray-200
            bg-gray-100 rounded
          "
          type="email"
          placeholder="lucas@winkle.com.br"
          v-model="email"
          required
        />
      </div>

      <button
        class="
          mt-4 p-4 w-full
          bg-gray-600 hover:bg-gray-700 text-gray-100
          rounded-full
          tracking-wide
          font-semibold font-display
          focus:outline-none focus:shadow-outline
          shadow-lg
        "
      >
        {{ $t('reset-password.form.submit') }}
      </button>
    </form>

    <ResetPasswordForm
      :email="email"
      @reset="$emit('goBack')"
      v-else
    />

    <button
      type="button"
      @click="$emit('goBack')"
      class="
        mt-6
        text-xs
        font-display font-semibold
        text-gray-600 hover:text-gray-800
        dark:text-gray-300 dark:hover:text-gray-100
        cursor-pointer
        flex items-center
        w-full
        justify-center
      "
    >
      {{ $t('i-remembered-my-password') }}
    </button>
  </div>
</template>