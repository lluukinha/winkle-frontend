<script setup lang="ts">
import { AxiosError } from 'axios';
import { onMounted, ref, Ref } from 'vue';
import { IUpdateUserEmail, IUser } from '../../repositories/user/UserInterfaces';
import UserRepository from '../../repositories/user/UserRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import Modal from '../shared/Modal.vue';
import EyeIcon from '../icons/EyeIcon.vue';

const { t } = i18n.element.global;
const isShowingPassword: Ref<boolean> = ref(false);
const firstInput: Ref<HTMLElement | undefined> = ref();
const formSubmit: Ref<HTMLElement | undefined> = ref();
const form: Ref<IUpdateUserEmail> = ref({
  email: '',
  confirmEmail: '',
  password: ''
});

const emit = defineEmits(["close", "save"]);
const clearForm = () => {
  form.value = { email: '', confirmEmail: '', password: '' };
  firstInput.value?.focus();
};
const handleClose = () => { emit("close"); };
const handleSave = (e: Event) => {
  e.preventDefault();

  if (form.value.email !== form.value.confirmEmail) {
    showError(t('api-errors.title'), t('user.messages.emails-dont-match'));
    clearForm();
    return;
  }

  WinkleScripts.setLoading(true);
  UserRepository.updateEmail(form.value)
    .then((updatedUser: IUser) => { emit("save", updatedUser); })
    .catch((e: AxiosError) => {
      showErrorMessage(e);
      clearForm();
    })
    .finally(() => { WinkleScripts.setLoading(false); });
};

const sendForm = () => { formSubmit.value?.click(); };

onMounted(() => { firstInput.value?.focus() });
</script>

<template>
  <Modal @save="sendForm()" @close="$emit('close')">
    <h2 class="text-xl font-bold py-4">{{ $t('user.update-email') }}</h2>
    <form @submit="handleSave">
      <button type="submit" class="hidden" ref="formSubmit"></button>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label for="email-input">
            {{ $t("user.update-email-form.email") }} *
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            ref="firstInput"
            id="email-input"
            type="email"
            v-model="form.email"
            required
            :placeholder="$t('user.update-email-form.email-placeholder')"
          />
        </div>
      </div>

      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label for="confirm-email-input">
            {{ $t("user.update-email-form.email-confirm") }} *
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            id="confirm-email-input"
            type="email"
            v-model="form.confirmEmail"
            required
            :placeholder="$t('user.update-email-form.email-confirm-placeholder')"
          />
        </div>
      </div>

      <hr class="dark:border-gray-600">

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label for="password-input">
            {{ $t("user.update-email-form.password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            class="input"
            id="password-input"
            :type="isShowingPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            :placeholder="$t('user.update-email-form.password-placeholder')"
          />
          <span
            class="span-button"
            @click="isShowingPassword = !isShowingPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingPassword" />
          </span>
        </div>
      </div>
    </form>
  </Modal>
</template>

<style lang="postcss" scoped>
label {
  @apply block text-gray-500 dark:text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4
}

.span-button {
  @apply  cursor-pointer
          bg-gray-200 dark:bg-gray-600
          hover:bg-gray-400 dark:hover:bg-gray-800
          flex items-center px-4
          select-none
          rounded rounded-tl-none rounded-bl-none
}

input {
  @apply  bg-gray-200 dark:bg-gray-500
            appearance-none
            border-2 border-gray-200 dark:border-gray-600
            rounded rounded-tr-none rounded-br-none
            w-full py-2 px-4
            text-gray-700 dark:text-gray-200
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
            dark:focus:bg-gray-400 dark:focus:border-purple-800
            dark:focus:text-gray-800
}
</style>