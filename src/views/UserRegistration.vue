<script setup lang="ts">
import { onBeforeMount, onMounted, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { IUserRegistration } from "../repositories/user/UserInterfaces";
import UserRepository from "../repositories/user/UserRepository";
import WinkleScripts from "../scripts/WinkleScripts";
import WinkleButton from "../components/shared/WinkleButton.vue";
import { showError, showSuccess } from "../scripts/NotificationScript";
import i18n from "../scripts/internacionalization/i18n";
import Modal from "../components/shared/Modal.vue";
import showErrorMessage from "../scripts/ErrorLogs";
import { AxiosError } from "axios";
import router from "../router";
import EyeIcon from "../components/shared/EyeIcon.vue";

const { t } = i18n.element.global;
const currentRoute = useRoute();

const formData: Ref<IUserRegistration> = ref({
  email: currentRoute.params.email.toString(),
  token: currentRoute.params.token.toString(),
  password: '',
  confirmPassword: '',
  masterPassword: '',
  confirmMasterPassword: ''
});

const isShowingPassword: Ref<boolean> = ref(false);
const isShowingMasterPassword: Ref<boolean> = ref(false);
const firstInput: Ref<HTMLElement | undefined> = ref();

const clearForm = () => {
  formData.value.password = '';
  formData.value.confirmPassword = '';
  formData.value.masterPassword = '';
  formData.value.confirmMasterPassword = '';
  firstInput.value?.focus();
};

const finishRegistration = (e: Event) => {
  e.preventDefault();

  const passwordsDoesNotMatch = (formData.value.password != formData.value.confirmPassword)
    || (formData.value.masterPassword != formData.value.confirmMasterPassword);
  const inputsHasLessThanSixCharacters = formData.value.password.length < 6
    || formData.value.confirmPassword.length < 6
    || formData.value.masterPassword.length < 6
    || formData.value.confirmMasterPassword.length < 6;
  const errorsTitle = t('api-errors.title');

  if (passwordsDoesNotMatch) {
      showError(errorsTitle, t('api-errors.passwords-dont-match'));
      clearForm();
      return;
  }

  if (inputsHasLessThanSixCharacters) {
      showError(errorsTitle, t('api-errors.must-be-at-least-6'));
      clearForm();
      return;
  }

  WinkleScripts.setLoading(true);
  UserRepository.finishRegistration(formData.value)
    .then(() => {
      router.push({ name: 'login' });
    })
    .catch((errors: AxiosError) => {
      showErrorMessage(errors);
      clearForm();
    })
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const isLoaded: Ref<boolean> = ref(false);
const hasErrorsOnVerification: Ref<boolean> = ref(false);
const isShowingMasterDetails: Ref<boolean> = ref(false);

const verifyIfUserCanBeCreated = () => {
  const email = currentRoute.params.email.toString();
  const token = currentRoute.params.token.toString();

  WinkleScripts.setLoading(true);
  UserRepository.verifyUserRegistration({ email, token })
    .then(() => {
      hasErrorsOnVerification.value = false;
    })
    .catch((e) => {
      hasErrorsOnVerification.value = true;
      console.error(e);
    })
    .finally(() => {
      WinkleScripts.setLoading(false);
      isLoaded.value = true;
      setTimeout(() => firstInput.value?.focus(), 200);
    })
};

onBeforeMount(() => { verifyIfUserCanBeCreated() });
</script>

<template>
  <div
    class="text-3xl flex flex-col justify-center items-center w-screen h-screen bg-gray-200"
    v-if="isLoaded && hasErrorsOnVerification"
  >
    <div>
      {{ $t('registration.not-available-1') }}<br>
      {{ $t('registration.not-available-2') }}
    </div>
    <WinkleButton
      type="info"
      class="mt-4"
      @click="$router.push({ name: 'logout' })"
    >
      {{ $t('enter') }}
    </WinkleButton>
  </div>
  <div
    class="w-screen bg-gray-300 h-screen pt-6"
    v-if="isLoaded && !hasErrorsOnVerification"
  >
    <Modal
      v-if="isShowingMasterDetails"
      :removeSave="true"
      @close="isShowingMasterDetails = false"
    >
      <h2 class="text-2xl font-bold uppercase">
        {{ $t('registration.master-password-help.title') }}
      </h2>
      <div class="text-justify my-4">
          <p class="mb-4" v-html="$t('registration.master-password-help.description-1')" />
          <p v-html="$t('registration.master-password-help.description-2')" />
      </div>
    </Modal>
    <h1 class="text-3xl mb-2">Finalize seu Cadastro</h1>
    <h1 class="text-xl mb-6 break-all">{{ formData.email }}</h1>
    <form
      class="mx-auto w-full md:w-2/3 rounded bg-gray-50 p-10 shadow-lg"
      @submit="finishRegistration" autocomplete="off"
    >

    <div class="text-left mb-4">
      <label for="password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('registration.form.password') }}
      </label>
      <div class="flex items-center">
        <input
          ref="firstInput"
          id="password-input"
          class="
            w-full
            text-lg
            p-2
            border-b border-gray-300
            focus:outline-none focus:border-gray-200
            bg-gray-100
            rounded rounded-tr-none rounded-br-none
          "
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.password-placeholder')"
          v-model="formData.password"
          required
        />
        <button
          type="button"
          @click="isShowingPassword = !isShowingPassword"
          class="bg-gray-200 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </button>
      </div>
    </div>

    <div class="text-left mb-4">
      <label for="confirm-password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('registration.form.confirm-password') }}
      </label>
      <div class="flex items-center">
        <input
          id="confirm-password-input"
          class="
            w-full
            text-lg
            p-2
            border-b border-gray-300
            focus:outline-none focus:border-gray-200
            bg-gray-100
            rounded rounded-tr-none rounded-br-none
          "
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.password-placeholder')"
          v-model="formData.confirmPassword"
          required
        />
        <button
          type="button"
          @click="isShowingPassword = !isShowingPassword"
          class="bg-gray-200 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </button>
      </div>
    </div>

    <div class="text-left mb-4">
      <label for="master-password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('registration.form.master-password') }}
        <span
          class="text-blue-700 text-xs hover:underline cursor-pointer"
          @click="isShowingMasterDetails = true"
        >
          ({{ $t('registration.master-password-help.what-is') }})
        </span>
      </label>
      <div class="flex items-center">
        <input
          id="master-password-input"
          class="
            w-full
            text-lg
            p-2
            border-b border-gray-300
            focus:outline-none focus:border-gray-200
            bg-gray-100
            rounded rounded-tr-none rounded-br-none
          "
          :type="isShowingMasterPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.master-password-placeholder')"
          v-model="formData.masterPassword"
          required
        />
        <button
          type="button"
          @click="isShowingMasterPassword = !isShowingMasterPassword"
          class="bg-gray-200 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none"
        >
          <EyeIcon :isShowing="isShowingMasterPassword" />
        </button>
      </div>
    </div>

    <div class="text-left mb-4">
      <label for="confirm-master-password-input" class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('registration.form.confirm-master-password') }}
      </label>
      <div class="flex items-center">
        <input
          id="confirm-master-password-input"
          class="
            w-full
            text-lg
            p-2
            border-b border-gray-300
            focus:outline-none focus:border-gray-200
            bg-gray-100
            rounded rounded-tr-none rounded-br-none
          "
          :type="isShowingMasterPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.master-password-placeholder')"
          v-model="formData.confirmMasterPassword"
          required
        />
        <button
          type="button"
          @click="isShowingMasterPassword = !isShowingMasterPassword"
          class="bg-gray-200 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none"
        >
          <EyeIcon :isShowing="isShowingMasterPassword" />
        </button>
      </div>
    </div>

    <WinkleButton type="success" class="w-full">
      {{ $t('registration.form.send-form') }}
    </WinkleButton>
    </form>
  </div>
</template>