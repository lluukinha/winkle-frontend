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
            <div>
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
