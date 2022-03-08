<script setup lang="ts">
import { AxiosError } from 'axios';
import { onMounted, ref, Ref } from 'vue';
import { IUpdateMasterPassword, IUser } from '../../repositories/user/UserInterfaces';
import UserRepository from '../../repositories/user/UserRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import * as dcodeIO from 'bcryptjs';
import Modal from '../shared/Modal.vue';
import LoginRepository from '../../repositories/login/LoginRepository';
import EyeIcon from '../icons/EyeIcon.vue';

const { t } = i18n.element.global;
const isShowingMasterPassword: Ref<boolean> = ref(false);
const isShowingCurrentMasterPassword: Ref<boolean> = ref(false);
const firstInput : Ref<HTMLElement | undefined> = ref();
const masterInput : Ref<HTMLElement | undefined> = ref();
const formSubmit: Ref<HTMLElement | undefined> = ref();
const form: Ref<IUpdateMasterPassword> = ref({
  password: '',
  oldMasterPassword: '',
  newMasterPassword: '',
  confirmNewMasterPassword: ''
});

const emit = defineEmits(["close", "save"]);
const clearForm = () => {
  form.value = {
    password: '',
    oldMasterPassword: '',
    newMasterPassword: '',
    confirmNewMasterPassword: ''
  };
  firstInput.value?.focus();
};
const handleClose = () => { emit("close"); };
const handleSave = async (e: Event) => {
  e.preventDefault();

  if (form.value.newMasterPassword !== form.value.confirmNewMasterPassword) {
    showError(t('api-errors.title'), t('user.messages.master-passwords-dont-match'));
    clearForm();
    return;
  }

  if (form.value.oldMasterPassword.length === 0 || !await localMasterMatch()) {
    showError(t('api-errors.title'), t('api-errors.master-password-incorrect'));
    clearMasterOnly();
    return;
  }

  WinkleScripts.setLoading(true);
  UserRepository.updateMasterPassword(form.value)
    .then(async (updatedUser: IUser) => {
      await LoginRepository.setMasterPassword(form.value.newMasterPassword);
      emit("save", updatedUser);
    })
    .catch((e: AxiosError) => {
      showErrorMessage(e);
      clearForm();
    })
    .finally(() => { WinkleScripts.setLoading(false); });
};

const clearMasterOnly = () : void => {
  form.value.oldMasterPassword = '';
  masterInput.value?.focus();
};

const localMasterMatch = async () : Promise<boolean> => {
  const masterPass = LoginRepository.loginData();
  if (!masterPass) return false;
  const result = await dcodeIO.compare(form.value.oldMasterPassword, masterPass.shuffled);
  return result;
};

const sendForm = () => { formSubmit.value?.click(); };

onMounted(() => { firstInput.value?.focus() });
</script>

<template>
 <Modal @save="sendForm()" @close="$emit('close')">
   <h2 class="text-xl font-bold py-4">{{ $t('user.update-master-password') }}</h2>
    <form @submit="handleSave">
      <button type="submit" class="hidden" ref="formSubmit"></button>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label for="new-password-input">
            {{ $t("user.update-master-password-form.new-master-password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            ref="firstInput"
            id="new-password-input"
            :type="isShowingMasterPassword ? 'text' : 'password'"
            v-model="form.newMasterPassword"
            required
            :placeholder="$t('user.update-master-password-form.new-master-password-placeholder')"
          />
          <span
            class="span-button"
            @click="isShowingMasterPassword = !isShowingMasterPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingMasterPassword" />
          </span>
        </div>
      </div>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label for="confirm-new-password-input">
            {{ $t("user.update-master-password-form.confirm-new-master-password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            id="confirm-new-password-input"
            :type="isShowingMasterPassword ? 'text' : 'password'"
            v-model="form.confirmNewMasterPassword"
            required
            :placeholder="$t('user.update-master-password-form.confirm-new-master-password-placeholder')"
          />
          <span
            class="span-button"
            @click="isShowingMasterPassword = !isShowingMasterPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingMasterPassword" />
          </span>
        </div>
      </div>

      <hr>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label for="old-master-password-input">
            {{ $t("user.update-master-password-form.old-master-password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            ref="masterInput"
            id="old-master-password-input"
            :type="isShowingCurrentMasterPassword ? 'text' : 'password'"
            v-model="form.oldMasterPassword"
            required
            :placeholder="$t('user.update-master-password-form.old-master-password-placeholder')"
          />
          <span
            class="span-button"
            @click="isShowingCurrentMasterPassword = !isShowingCurrentMasterPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingCurrentMasterPassword" />
          </span>
        </div>
      </div>

      <div class="md:flex md:items-center mb-6 mt-6">
        <div class="md:w-1/3">
          <label for="password-input">
            {{ $t("user.update-master-password-form.password") }} *
          </label>
        </div>
        <div class="md:w-2/3 flex">
          <input
            id="password-input"
            :type="isShowingCurrentMasterPassword ? 'text' : 'password'"
            v-model="form.password"
            required
            :placeholder="$t('user.update-master-password-form.password-placeholder')"
          />
          <span
            class="span-button"
            @click="isShowingCurrentMasterPassword = !isShowingCurrentMasterPassword"
            :title="$t('passwords.form.show-password')"
          >
            <EyeIcon :isShowing="isShowingCurrentMasterPassword" />
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