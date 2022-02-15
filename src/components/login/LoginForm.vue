<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from "vue";
import router from "../../router";
import LoginRepository from "../../repositories/login/LoginRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import { AxiosError } from "axios";
import { showError } from "../../scripts/NotificationScript";
import i18n from "../../scripts/internacionalization/i18n";

const { t } = i18n.element.global;
const firstInput : Ref<HTMLElement | null> = ref(null);
const loginForm = reactive({ email: '', password: '' });

const doLogin = (e: Event) => {
  e.preventDefault();

  WinkleScripts.setLoading(true);
  LoginRepository.doLogin(loginForm)
    .then(() => {
      const master = prompt('Insira sua senha mestre');
      if (master) {
        LoginRepository.setMasterPassword(master);
        router.push({ name: 'dashboard' });
      }
    })
    .catch((e: AxiosError) => {
      const failed : boolean = e.response?.status === 401
        && e.response?.statusText === 'Unauthorized';
      if (failed) {
        showError(t('login.login-failed'), t('login.user-not-found'));
      } else {
        console.log(e.response);
      }
    })
    .finally(() => { WinkleScripts.setLoading(false); });
}

onMounted(() => {
  firstInput.value?.focus();
  if (LoginRepository.canUseLoginInfo()) router.push({ name: 'dashboard' });
})
</script>

<template>
  <form @submit="doLogin">
    <div class="text-left">
      <div class="text-sm font-bold text-gray-700 tracking-wide">
        {{ $t('login.email') }}
      </div>
      <input
        ref="firstInput"
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="email"
        placeholder="lucas@winkle.com.br"
        v-model="loginForm.email"
        required
      />
    </div>

    <div class="mt-8">
      <div class="flex justify-between items-center">
        <div class="text-sm font-bold text-gray-700 tracking-wide">
          {{ $t('login.password') }}
        </div>
        <!-- div>
          <a
            class="
              text-xs
              font-display font-semibold
              text-indigo-600
              hover:text-indigo-800
              cursor-pointer
            "
          >
            Forgot Password?
          </a>
        </div -->
      </div>
      <input
        class="
          w-full
          text-lg
          p-2
          border-b border-gray-300
          focus:outline-none focus:border-gray-200
          bg-gray-100
          rounded
        "
        type="password"
        :placeholder="$t('login.password-placeholder')"
        v-model="loginForm.password"
        required
      />
    </div>
    <div class="mt-10">
      <button
        class="
          bg-gray-600
          text-gray-100
          p-4
          w-full
          rounded-full
          tracking-wide
          font-semibold font-display
          focus:outline-none focus:shadow-outline
          hover:bg-gray-800
          shadow-lg
        "
      >
        {{ $t('login.enter') }}
      </button>
    </div>
  </form>
</template>
