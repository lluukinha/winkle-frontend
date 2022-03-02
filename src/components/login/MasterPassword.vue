<script setup lang="ts">
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { ILoginInfo } from "../../repositories/login/ILoginInfo";
import { IMasterPasswordConfig } from "../../repositories/login/IMasterPasswordConfig";
import LoginRepository from "../../repositories/login/LoginRepository";
import showErrorMessage from "../../scripts/ErrorLogs";
import i18n from "../../scripts/internacionalization/i18n";
import { showError } from "../../scripts/NotificationScript";
import WinkleScripts from "../../scripts/WinkleScripts";
import router from "../../router";

const { t } = i18n.element.global;
const failedCounter: Ref<number> = ref(0);
const systemOk: Ref<boolean> = ref(false);
const masterPassword: Ref<string> = ref('');
const masterInput: Ref<HTMLElement | undefined> = ref();
const minutesToExpire: Ref<number> = ref(15);
const loginData: Ref<ILoginInfo | null> = ref(null);
const isShowingMasterPassword: Ref<boolean> = ref(false);

const emit = defineEmits(['failed', 'success']);

const setMasterPassword = () : void => {
  systemOk.value = true;
  setTimeout(() => {
    const masterPasswordConfig: IMasterPasswordConfig = {
      masterPassword: masterPassword.value,
      minutesToExpire: minutesToExpire.value,
      lastLogin: new Date()
    };
    LoginRepository.setMasterPassword(masterPasswordConfig);
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
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); })
};

onBeforeMount(() => {
  const newLoginData = LoginRepository.loginData();
  if (!newLoginData) router.push({ name: 'logout' });
  loginData.value = newLoginData;

})

onMounted(() => {
  masterInput.value?.focus();
});
</script>

<template>
  <div class="w-screen h-screen bg-gray-300 overflow-hidden">
    <div
      class="bg-gradient-to-b from-cyan-700 to-gray-500 transition-all duration-300 border-b-8 overflow-hidden w-full"
      :class="{ 'h-[35vh]': !systemOk, 'h-0': systemOk, }"
    >
    </div>
    <div
      class="bg-gradient-to-b from-gray-800 to-gray-700 pt-10 transition-all duration-300 w-full overflow-hidden"
      :class="{ 'h-[65vh]': !systemOk, 'h-0 fixed bottom-0': systemOk }"
    >
      <div class="flex flex-col justify-center">
        <h3 class="text-xl font-bold text-gray-100 mb-2">
          {{ $t('hello') }} {{ loginData?.user }}
          <router-link
            tag="span"
            class="text-sm font-normal text-gray-400 hover:underline"
            :to="{ name: 'logout' }"
          >
            ({{ $t('leave') }})
          </router-link>,
        </h3>
        <h2 class="text-2xl uppercase font-bold text-gray-100 drop-shadow-lg whitespace-pre-wrap">
          {{ $t('master-password.message') }}:
        </h2>
        <div class="mt-4">
          <form @submit="checkMasterPassword">
            <div class="flex justify-center items-center">
              <input
                ref="masterInput"
                class="rounded rounded-tr-none rounded-br-none p-2 bg-gray-200 focus:bg-gray-50"
                :type="isShowingMasterPassword ? 'text' : 'password'"
                v-model="masterPassword"
                required
              />
              <span
                @click="isShowingMasterPassword = !isShowingMasterPassword"
                class="bg-gray-300 hover:bg-gray-400 px-2 py-3 rounded rounded-tl-none rounded-bl-none cursor-pointer"
              >
                <!-- EYE ICON -->
                <svg v-if="!isShowingMasterPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>

                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <!-- END EYE ICON -->
              </span>
              <button
                class="bg-green-400 hover:bg-green-500 shadow font-semibold rounded p-2 px-4 ml-2"
              >
                {{ $t('enter') }}
              </button>
            </div>
            <div>
              <span class="text-gray-200">
                {{ $t('master-password.expires-in') }}:
              </span>
              <select
                class="mt-4 bg-transparent text-gray-400"
                v-model="minutesToExpire"
              >
                <option :value="15">15 {{ $t('master-password.minutes') }}</option>
                <option :value="30">30 {{ $t('master-password.minutes') }}</option>
                <option :value="45">45 {{ $t('master-password.minutes') }}</option>
                <option :value="60">60 {{ $t('master-password.minutes') }}</option>
                <option :value="1440">{{ $t('master-password.all-day') }}</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
