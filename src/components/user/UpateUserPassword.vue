<script setup lang="ts">
import { AxiosError } from 'axios';
import { onMounted, ref, Ref } from 'vue';
import { IUpdatePassword, IUpdateUserEmail, IUser } from '../../repositories/user/UserInterfaces';
import UserRepository from '../../repositories/user/UserRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import Modal from '../shared/Modal.vue';
import EyeIcon from '../shared/EyeIcon.vue';

const { t } = i18n.element.global;
const isShowingPassword: Ref<boolean> = ref(false);
const isShowingNewPassword: Ref<boolean> = ref(false);
const firstInput : Ref<HTMLElement | undefined> = ref();
const formSubmit: Ref<HTMLElement | undefined> = ref();
const form: Ref<IUpdatePassword> = ref({
  password: '',
  newPassword: '',
  confirmNewPassword: ''
});

const emit = defineEmits(["close", "save"]);
const clearForm = () => {
  form.value = { password: '', newPassword: '', confirmNewPassword: '' };
  firstInput.value?.focus();
};
const handleClose = () => { emit("close"); };
const handleSave = (e: Event) => {
  e.preventDefault();

  if (form.value.newPassword !== form.value.confirmNewPassword) {
    showError(t('api-errors.title'), t('user.messages.passwords-dont-match'));
    clearForm();
    return;
  }

  WinkleScripts.setLoading(true);
  UserRepository.updatePassword(form.value)
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
   <h2 class="text-xl font-bold py-4">{{ $t('user.update-password') }}</h2>
    <form @submit="handleSave">
      <button type="submit" class="hidden" ref="formSubmit"></button>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
            for="new-password-input"
          >
            {{ $t("user.update-password-form.new-password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            ref="firstInput"
            class="
              bg-gray-200
              appearance-none
              border-2 border-gray-200
              rounded rounded-tr-none rounded-br-none
              w-full
              py-2 px-4
              text-gray-700
              leading-tight
              focus:outline-none focus:bg-white focus:border-purple-500
            "
            id="new-password-input"
            :type="isShowingNewPassword ? 'text' : 'password'"
            v-model="form.newPassword"
            required
            :placeholder="$t('user.update-password-form.new-password-placeholder')"
          />
          <span
            class="
              cursor-pointer
              bg-gray-300
              hover:bg-gray-400 flex items-center px-4
              select-none
              rounded rounded-tl-none rounded-bl-none
            "
            @click="isShowingNewPassword = !isShowingNewPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingNewPassword" />
          </span>
        </div>
      </div>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
            for="confirm-new-password-input"
          >
            {{ $t("user.update-password-form.confirm-new-password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            class="
              bg-gray-200
              appearance-none
              border-2 border-gray-200
              rounded rounded-tr-none rounded-br-none
              w-full
              py-2 px-4
              text-gray-700
              leading-tight
              focus:outline-none focus:bg-white focus:border-purple-500
            "
            id="confirm-new-password-input"
            :type="isShowingNewPassword ? 'text' : 'password'"
            v-model="form.confirmNewPassword"
            required
            :placeholder="$t('user.update-password-form.confirm-new-password-placeholder')"
          />
          <span
            class="
              cursor-pointer
              bg-gray-300
              hover:bg-gray-400 flex items-center px-4
              select-none
              rounded rounded-tl-none rounded-bl-none
            "
            @click="isShowingNewPassword = !isShowingNewPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingNewPassword" />
          </span>
        </div>
      </div>

      <hr>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label
            class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
            for="password-input"
          >
            {{ $t("user.update-password-form.password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            class="
              bg-gray-200
              appearance-none
              border-2 border-gray-200
              rounded rounded-tr-none rounded-br-none
              w-full
              py-2 px-4
              text-gray-700
              leading-tight
              focus:outline-none focus:bg-white focus:border-purple-500
            "
            id="password-input"
            :type="isShowingPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            :placeholder="$t('user.update-password-form.password-placeholder')"
          />
          <span
            class="
              cursor-pointer
              bg-gray-300
              hover:bg-gray-400 flex items-center px-4
              select-none
              rounded rounded-tl-none rounded-bl-none
            "
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

<style scoped></style>