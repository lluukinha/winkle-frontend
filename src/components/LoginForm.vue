<script setup lang="ts">
import { reactive /* , ref */ } from "vue";
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
// const email = ref(""); -- USE REF TO SINGLE VALUES AND REACTIVE TO OBJECTS
// const password = ref("");
const loginForm = reactive({ email: '', password: '' });

const doLogin = (e: Event) => {
  e.preventDefault();
  LoginRepository.doLogin(loginForm)
    .then(() => { router.push('/dashboard'); })
    .catch((error) => { console.log({ error }); });
}

const handleUserLoggedIn = () => {
  if (LoginRepository.canUseLoginInfo) router.push('/dashboard');
};

handleUserLoggedIn();
</script>

<template>
  <form @submit="doLogin">
    <div class="text-left">
      <div class="text-sm font-bold text-gray-700 tracking-wide">
        Email Address
      </div>
      <input
        class="
          w-full
          text-lg
          py-2
          border-b border-gray-300
          focus:outline-none focus:border-indigo-500
        "
        type="email"
        placeholder="mike@gmail.com"
        v-model="loginForm.email"
      />
    </div>

    <div class="mt-8">
      <div class="flex justify-between items-center">
        <div class="text-sm font-bold text-gray-700 tracking-wide">
          Password
        </div>
        <div>
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
        </div>
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
        placeholder="Enter your password"
        v-model="loginForm.password"
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
        Log In
      </button>
    </div>
  </form>
</template>
