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
import EyeIcon from "../components/icons/EyeIcon.vue";

const { t } = i18n.element.global;
const currentRoute = useRoute();

const formData: Ref<IUserRegistration> = ref({
  name: '',
  area_code: null,
  phone: null,
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
const isFinished: Ref<boolean> = ref(true);
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

onBeforeMount(() => { verifyIfUserCanBeCreated(); });
</script>

<template>
  <div class="content" v-if="isLoaded && (hasErrorsOnVerification || isFinished)">
    <div>
      <template v-if="!isFinished">
        {{ $t('registration.not-available-1') }}<br>
        {{ $t('registration.not-available-2') }}
      </template>
      <template v-else>
        {{ $t('registration.finished-1') }}<br>
        {{ $t('registration.finished-2') }}
      </template>
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
    class="
      w-screen h-screen pt-6
      bg-gray-300 dark:bg-gray-700
      dark:text-gray-100
    "
    v-if="isLoaded && !hasErrorsOnVerification && !isFinished"
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

    <h1 class="text-3xl mb-2">{{ $t('registration.title') }}</h1>
    <h1 class="text-xl mb-6 break-all">{{ formData.email }}</h1>
    <form
      class="mx-auto w-full md:w-2/3 rounded bg-gray-50 dark:bg-gray-800 p-10 shadow-lg"
      @submit="finishRegistration" autocomplete="off"
    >

    <div class="flex justify-center">
      <div class="md:pr-4 w-full">
        <div class="text-left mb-4">
          <label for="name-input">
            {{ $t('registration.form.name') }}
          </label>
          <input
            ref="firstInput"
            id="name-input"
            type="text"
            :placeholder="$t('registration.form.name')"
            v-model="formData.name"
            required
          />
        </div>

        <div class="text-left mb-4">
          <label for="phone-input">
            {{ $t('registration.form.phone') }}
            <span class="text-xs text-gray-400 font-normal">
              ({{ $t('registration.form.only-numbers') }})
            </span>
          </label>
          <div class="flex items-center">
            <div class="w-24 mr-1">
              <input
                id="ddd-input"
                type="number"
                :placeholder="$t('registration.form.ddd')"
                v-model="formData.area_code"
              />
            </div>
            <input
              id="phone-input"
              type="number"
              :placeholder="$t('registration.form.phone')"
              v-model="formData.phone"
            />
          </div>
        </div>

        <div class="text-left mb-4">
          <label>
            {{ $t('registration.form.email') }}
          </label>
          <input type="email" :value="formData.email" disabled />
        </div>
      </div>

      <div class="px-10 w-full">
    <div class="text-left mb-4">
      <label for="password-input">
        {{ $t('registration.form.password') }}
      </label>
      <div class="flex items-center">
        <input
          id="password-input"
          class="no-round"
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.password-placeholder')"
          v-model="formData.password"
          required
        />
        <span
          @click="isShowingPassword = !isShowingPassword"
          class="span-button"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </span>
      </div>
    </div>

    <div class="text-left mb-4">
      <label for="confirm-password-input">
        {{ $t('registration.form.confirm-password') }}
      </label>
      <div class="flex items-center">
        <input
          id="confirm-password-input"
          class="no-round"
          :type="isShowingPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.password-placeholder')"
          v-model="formData.confirmPassword"
          required
        />
        <span
          @click="isShowingPassword = !isShowingPassword"
          class="span-button"
        >
          <EyeIcon :isShowing="isShowingPassword" />
        </span>
      </div>
    </div>

    <div class="text-left mb-4">
      <label for="master-password-input">
        {{ $t('registration.form.master-password') }}
        <span
          class="text-blue-700 dark:text-yellow-400 text-xs hover:underline cursor-pointer"
          @click="isShowingMasterDetails = true"
        >
          ({{ $t('registration.master-password-help.what-is') }})
        </span>
      </label>
      <div class="flex items-center">
        <input
          id="master-password-input"
          class="no-round"
          :type="isShowingMasterPassword ? 'text' : 'password'"
          :placeholder="$t('registration.form.master-password-placeholder')"
          v-model="formData.masterPassword"
          required
        />
        <span
          @click="isShowingMasterPassword = !isShowingMasterPassword"
          class="span-button"
        >
          <EyeIcon :isShowing="isShowingMasterPassword" />
        </span>
      </div>
    </div>

          <div class="text-left mb-4">
            <label for="confirm-master-password-input">
              {{ $t('registration.form.confirm-master-password') }}
            </label>
            <div class="flex items-center">
              <input
                id="confirm-master-password-input"
                class="no-round"
                :type="isShowingMasterPassword ? 'text' : 'password'"
                :placeholder="$t('registration.form.master-password-placeholder')"
                v-model="formData.confirmMasterPassword"
                required
              />
              <span
                @click="isShowingMasterPassword = !isShowingMasterPassword"
                class="span-button"
              >
                <EyeIcon :isShowing="isShowingMasterPassword" />
              </span>
            </div>
          </div>

        </div>
      </div>

      <WinkleButton type="success" class="w-full">
        {{ $t('registration.form.send-form') }}
      </WinkleButton>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
input {
  @apply  p-2 w-full
          focus:outline-none focus:border-gray-200
          bg-gray-100 dark:bg-gray-600
          rounded;
}

input:disabled {
  @apply dark:bg-gray-700 dark:bg-opacity-50 text-gray-400;
}

.no-round {
  border-bottom-right-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

label {
  @apply text-sm font-bold text-gray-700 dark:text-gray-200 tracking-wide
}

.span-button {
  @apply  bg-gray-200 hover:bg-gray-400
          dark:bg-gray-600 dark:hover:bg-gray-700
          px-2 py-3
          rounded rounded-tl-none rounded-bl-none;
}

.content {
  @apply  text-3xl flex flex-col justify-center items-center
          w-screen h-screen dark:text-gray-100
          bg-gray-200 dark:bg-gray-800;
}
</style>