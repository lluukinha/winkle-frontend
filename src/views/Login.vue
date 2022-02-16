<script setup lang="ts">
import { onBeforeMount, onMounted, Ref, ref } from "vue";
import LoginScreen from "../components/login/LoginScreen.vue";
import LoginRepository from "../repositories/login/LoginRepository";
import router from "../router";
import showErrorMessage from "../scripts/ErrorLogs";
import { showError } from "../scripts/NotificationScript";
import WinkleScripts from "../scripts/WinkleScripts";

const loggedIn: Ref<boolean> = ref(false);
const systemOk: Ref<boolean> = ref(false);
const masterPassword: Ref<string> = ref('');
const failedCounter: Ref<number> = ref(0);
const masterInput: Ref<HTMLElement | null> = ref(null);

onBeforeMount(() => {
  const masterPass = LoginRepository.getMasterPassword();

  if (LoginRepository.canUseLoginInfo()) {
    if (masterPass != null) router.push({ name: 'dashboard' });
    if (masterPass == null) loggedIn.value = true;
  }
});

onMounted(() => { masterInput.value?.focus(); });

const loginFinished = () => {
  loggedIn.value = true;
  setTimeout(() => { masterInput.value?.focus(); }, 500);
};

const setMasterPassword = () : void => {
  systemOk.value = true;
  setTimeout(() => {
    LoginRepository.setMasterPassword(masterPassword.value);
    router.push({ name: 'dashboard' });
  }, 300);
};

const invalidMasterPassword = () => {
  showError('Erro', 'Senha mestre está incorreta.');
  masterPassword.value = '';
  failedCounter.value += 1;
  if (failedCounter.value === 3) {
    LoginRepository.removeLoginInfo();
    loggedIn.value = false;
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
</script>

<template>
  <LoginScreen
    v-if="!loggedIn"
    @loginFinished="loginFinished()"
  />
  <div class="w-screen h-screen bg-gray-300" v-if="loggedIn">
    <div
      class="bg-gradient-to-b from-cyan-700 to-gray-500 transition-all duration-300"
      :class="{
        'h-[35vh]': !systemOk,
        'h-0': systemOk,
      }"
    >
    </div>
    <div
      class="bg-gradient-to-b from-gray-800 to-gray-700 pt-10 transition-all duration-300 w-screen"
      :class="{
        'h-[65vh]': !systemOk,
        'h-0 fixed bottom-0': systemOk
      }"
    >
      <div class="flex flex-col justify-center">
        <h2 class="text-2xl uppercase font-bold text-gray-100 drop-shadow-lg">
          Insira sua senha mestre:
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
            Entrar
          </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>