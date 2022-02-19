<script setup lang="ts">
import { onMounted, ref, Ref } from "vue";
import LoginRepository from "../../repositories/login/LoginRepository";
import router from "../../router";
import showErrorMessage from "../../scripts/ErrorLogs";
import i18n from "../../scripts/internacionalization/i18n";
import { showError } from "../../scripts/NotificationScript";
import WinkleScripts from "../../scripts/WinkleScripts";

const { t } = i18n.element.global;
const failedCounter: Ref<number> = ref(0);
const systemOk: Ref<boolean> = ref(false);
const masterPassword: Ref<string> = ref('');
const masterInput: Ref<HTMLElement | undefined> = ref();

const emit = defineEmits(['failed']);

const setMasterPassword = () : void => {
  systemOk.value = true;
  setTimeout(() => {
    LoginRepository.setMasterPassword(masterPassword.value);
    router.push({ name: 'dashboard' });
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
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); })
};

onMounted(() => { masterInput.value?.focus(); });
</script>

<template>
  <div class="w-screen h-screen bg-gray-300">
    <div
      class="bg-gradient-to-b from-cyan-700 to-gray-500 transition-all duration-300 border-b-8"
      :class="{ 'h-[35vh]': !systemOk, 'h-0': systemOk, }"
    >
    </div>
    <div
      class="bg-gradient-to-b from-gray-800 to-gray-700 pt-10 transition-all duration-300 w-screen"
      :class="{ 'h-[65vh]': !systemOk, 'h-0 fixed bottom-0': systemOk }"
    >
      <div class="flex flex-col justify-center">
        <h2 class="text-2xl uppercase font-bold text-gray-100 drop-shadow-lg">
          {{ $t('master-password.message') }}:
        </h2>
        <div class="mt-4">
          <form @submit="checkMasterPassword">
          <input
            ref="masterInput"
            class="rounded rounded-tr-none rounded-br-none p-2 bg-gray-200 focus:bg-gray-50"
            type="password"
            v-model="masterPassword"
            required
          />
          <button class="bg-gray-200 rounded rounded-tl-none rounded-bl-none p-2">
            {{ $t('enter') }}
          </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
