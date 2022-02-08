<script setup lang="ts">
import { onMounted, reactive, ref, Ref } from "vue";
import router from "../../router";
import LoginRepository from "../../repositories/login/LoginRepository";
import LoadingScript from "../../scripts/LoadingScript";

const firstInput : Ref<HTMLElement> = ref(null);
const loginForm = reactive({ email: '', password: '' });

const doLogin = (e: Event) => {
  e.preventDefault();

  LoadingScript.setLoading(true);
  LoginRepository.doLogin(loginForm)
    .then(() => { router.push({ name: 'dashboard' }); })
    .catch((error) => { console.log({ error }); })
    .finally(() => { LoadingScript.setLoading(false); });
}

onMounted(() => {
  firstInput.value.focus();
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
          py-2
          border-b border-gray-300
          focus:outline-none focus:border-indigo-500
        "
        type="email"
        :placeholder="$t('login.email-placeholder')"
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
          py-2
          border-b border-gray-300
          focus:outline-none focus:border-indigo-500
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
          bg-indigo-500
          text-gray-100
          p-4
          w-full
          rounded-full
          tracking-wide
          font-semibold font-display
          focus:outline-none focus:shadow-outline
          hover:bg-indigo-600
          shadow-lg
        "
      >
        {{ $t('login.enter') }}
      </button>
    </div>
  </form>
</template>
