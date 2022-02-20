<script setup lang="ts">
import { AxiosError } from "axios";
import { ref, Ref } from "vue";
import LoginRepository from "../../repositories/login/LoginRepository";
import { IResetPassword } from "../../repositories/user/UserInterfaces";
import showErrorMessage from "../../scripts/ErrorLogs";
import i18n from "../../scripts/internacionalization/i18n";
import { showError, showSuccess } from "../../scripts/NotificationScript";
import WinkleScripts from "../../scripts/WinkleScripts";

const { t } = i18n.element.global;
const props = defineProps<{ email: string, token?: string }>();
const emit = defineEmits(['reset']);
const tokenIsReadOnly : boolean = !!props.token;

const form: Ref<IResetPassword> = ref({
  token: props.token || '',
  email: props.email,
  password: '',
  confirmPassword: ''
});

const clearForm = () => {
  if (!props.token) form.value.token = '';
  form.value.password = '';
  form.value.confirmPassword = '';
};

const resetPassword = (e: Event) => {
  e.preventDefault();

  if (form.value.password !== form.value.confirmPassword) {
    showError(
      t('api-errors.title'),
      t('api-errors.passwords-dont-match')
    );
    clearForm();
    return;
  }

  WinkleScripts.setLoading(true);
  LoginRepository.resetPassword(form.value)
    .then(() => {
      showSuccess(
        t('reset-password.message-reseted'),
        t('reset-password.message-reseted-description')
      );
      emit('reset');
    })
    .catch((errors: AxiosError) => {
      showErrorMessage(errors);
      clearForm();
    })
    .finally(() => {
        WinkleScripts.setLoading(false);
    });
}
</script>

<template>
  <form @submit="resetPassword" autocomplete="off">
    <div class="text-left mb-4">
      <label for="email-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('reset-password.form.token') }}
      </label>
      <input
        id="token-input"
        :readonly="tokenIsReadOnly"
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="text"
        :placeholder="$t('reset-password.form.token-placeholder')"
        v-model="form.token"
        required
      />
    </div>

    <hr>

    <div class="text-left mt-4">
      <label for="password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('reset-password.form.password') }}
      </label>
      <input
        id="password-input"
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="password"
        :placeholder="$t('reset-password.form.password-placeholder')"
        v-model="form.password"
        required
      />
    </div>

    <div class="text-left mt-4">
      <label for="confirm-password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('reset-password.form.confirm-password') }}
      </label>
      <input
        id="confirm-password-input"
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="password"
        :placeholder="$t('reset-password.form.confirm-password-placeholder')"
        v-model="form.confirmPassword"
        required
      />
    </div>

    <button
      class="
        mt-4
        bg-gray-600
        text-gray-100
        p-4
        w-full
        rounded-full
        tracking-wide
        font-semibold font-display
        focus:outline-none focus:shadow-outline
        hover:bg-gray-800
        shadow-lg
      "
    >
      {{ $t('reset-password.form.submit') }}
    </button>
  </form>
</template>

<style></style>
