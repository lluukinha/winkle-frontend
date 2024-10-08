<script setup lang="ts">
import WinkleImg from "../shared/WinkleImg.vue";
import LanguageSelector from "../shared/LanguageSelector.vue";
defineProps<{ title: string }>();
</script>

<template>
<div class="h-screen w-screen flex justify-center bg-gray-300 dark:bg-gray-900">
  <div class="lg:flex container">
    <div
      class="
        lg:w-1/2 xl:max-w-screen-sm h-screen
        bg-white dark:bg-gray-800
        flex flex-col justify-center px-10 lg:px-16 xl:px-20
      "
    >
      <div class="flex justify-between">
        <router-link
          tag="div"
          class="
            cursor-pointer
            flex justify-center md:justify-start items-center
            select-none drop-shadow
          "
          :to="{ name: 'login' }"
        >
          <img src="../../assets/logo-white.png" class="w-20 px-0 mr-2 hidden dark:inline" />
          <img src="../../assets/logo-dark.png" class="w-20 px-0 mr-2 dark:hidden" />
          <div class="flex flex-col items-start text-gray-800 dark:text-gray-100">
            <span class="text-5xl font-bold italic">Winkle</span>
            <span class="text-sm ml-1">{{ $t('app-description') }}</span>
          </div>
        </router-link>
        <div class="flex items-center justify-end">
          <LanguageSelector class="bg-white dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 dark:focus:text-white text-xl md:text-2xl" />
        </div>
      </div>

      <h2
        class="
          text-center text-2xl text-gray-800 dark:text-gray-100
          font-display font-semibold
          lg:text-left my-4
        "
      >
        {{ title }}
      </h2>

      <div class="mt-4">
        <slot></slot>
        <div
          class="
            mt-12 text-sm font-display font-semibold
            text-gray-800 dark:text-gray-100 text-center
          "
        >
          {{ $t('login.no-account') }}
          <a
            class="
              cursor-pointer
              text-indigo-600 hover:text-indigo-800
              dark:text-yellow-300 dark:hover:text-yellow-500
            "
            href="https://www.winkle.com.br"
            targett="_blank"
          >
            {{ $t('login.sign-up') }}
          </a>
        </div>
      </div>
    </div>
    <div class="hidden h-screen lg:flex items-center justify-center flex-1">
      <div class="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
        <WinkleImg />
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.st0 {
  fill: none;
  stroke: currentColor;
  stroke-width: 20;
  stroke-linecap: round;
  stroke-miterlimit: 3;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
