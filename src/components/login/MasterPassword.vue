<script setup lang="ts">
import { onBeforeMount, onMounted, ref, Ref } from 'vue';
import LoginRepository from '../../repositories/login/LoginRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import router from '../../router';
import WinkleButton from '../shared/WinkleButton.vue';
import EyeIcon from '../icons/EyeIcon.vue';
import SidebarScript from '../../scripts/SidebarScript';

const { t } = i18n.element.global;
const failedCounter: Ref<number> = ref(0);
const systemOk: Ref<boolean> = ref(false);
const masterPassword: Ref<string> = ref('');
const masterInput: Ref<HTMLElement | undefined> = ref();
const isShowingMasterPassword: Ref<boolean> = ref(false);

const emit = defineEmits(['failed', 'success']);

const setMasterPassword = (): void => {
  systemOk.value = true;
  setTimeout(async () => {
    await LoginRepository.setMasterPassword(masterPassword.value);
    emit('success');
  }, 300);
};

const invalidMasterPassword = () => {
  const titleMsg = t('api-errors.title');
  const descriptionMsg = t('api-errors.master-password-incorrect');
  showError(titleMsg, descriptionMsg);
  masterPassword.value = '';
  failedCounter.value += 1;
  if (failedCounter.value === 3) {
    LoginRepository.removeLoginInfo();
    emit('failed');
  }
};

const checkMasterPassword = (e: Event) => {
  e.preventDefault();

  WinkleScripts.setLoading(true);
  LoginRepository.checkMasterPassword(masterPassword.value)
    .then((result: boolean) => {
      if (!result) {
        invalidMasterPassword();
        return;
      }

      setMasterPassword();
    })
    .catch(invalidMasterPassword)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

onBeforeMount(() => {
  if (!LoginRepository.loginData.value) router.push({ name: 'logout' });
});

onMounted(() => {
  masterInput.value?.focus();
  SidebarScript.toggleSidebar(false);
  if (LoginRepository.canUseMasterPassword()) emit('success');
});
</script>

<template>
  <div class="w-screen h-screen bg-gray-300 dark:bg-gray-600 overflow-hidden">
    <div
      class="bg-gradient-to-b from-gray-600 to-gray-800 transition-all duration-300 border-b-8 dark:border-gray-600 overflow-hidden w-full flex justify-center items-end"
      :class="{ 'h-[35vh]': !systemOk, 'h-0': systemOk }"
    >
      <div
        class="cursor-pointer flex items-center select-none mb-10 drop-shadow"
      >
        <img
          src="../../assets/logo-white.png"
          class="w-24 px-0 md:w-32 mr-2 drop-shadow-lg"
        />
        <div class="flex flex-col items-start text-gray-50">
          <span class="text-6xl font-bold italic">Winkle</span>
          <span class="text-sm ml-1">{{ $t('app-description') }}</span>
        </div>
      </div>
    </div>
    <div
      class="bg-gradient-to-b from-gray-800 to-gray-600 pt-10 transition-all duration-300 w-full overflow-hidden"
      :class="{ 'h-[65vh]': !systemOk, 'h-0 fixed bottom-0': systemOk }"
    >
      <div class="flex flex-col justify-center items-center">
        <h3 class="text-xl text-gray-100 mb-2">
          {{ $t('hello') }}
          <span class="font-bold">{{
            LoginRepository.loginData.value?.user
          }}</span>
          <router-link
            tag="span"
            class="text-sm text-gray-400 hover:underline"
            :to="{ name: 'logout' }"
          >
            ({{ $t('leave') }}) </router-link
          >,
        </h3>
        <h2
          class="text-xl uppercase text-gray-300 drop-shadow-lg whitespace-pre-wrap"
        >
          {{ $t('master-password.message') }}:
        </h2>
        <div class="mt-4">
          <form @submit="checkMasterPassword" autocomplete="off">
            <div class="w-full">
              <div
                class="flex justify-center items-center mb-2 px-4 w-full md:w-72 md:mx-auto"
              >
                <input
                  ref="masterInput"
                  class="rounded rounded-tr-none rounded-br-none p-2 bg-gray-200 focus:bg-gray-50 w-full px-4"
                  :type="isShowingMasterPassword ? 'text' : 'password'"
                  v-model="masterPassword"
                  :placeholder="$t('master-password.message')"
                  required
                  autocomplete="off"
                />
                <span
                  @click="isShowingMasterPassword = !isShowingMasterPassword"
                  class="bg-gray-300 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none cursor-pointer"
                >
                  <EyeIcon :isShowing="isShowingMasterPassword" />
                </span>
              </div>
              <div class="px-4 w-full md:w-72 md:mx-auto">
                <WinkleButton type="success" class="w-full">
                  {{ $t('enter') }}
                </WinkleButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
