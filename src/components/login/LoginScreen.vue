<script setup lang="ts">
import WinkleImg from "../shared/WinkleImg.vue";
defineProps<{ title: string }>();
</script>

<template>
<div class="h-screen w-screen flex justify-center bg-gray-300">
  <div class="lg:flex container">
    <div class="lg:w-1/2 xl:max-w-screen-sm bg-white h-screen">
      <div
        class="
          py-6 md:py-12
          bg-gray-100
          lg:bg-white
          flex
          justify-center
          lg:justify-start lg:px-12
        "
      >
        <router-link
          tag="div"
          class="cursor-pointer flex items-center select-none drop-shadow"
          :to="{ name: 'login' }"
        >
          <img
            src="../../assets/logo-dark.png"
            class="w-24 px-0 md:w-32 mr-2"
          />
          <div class="flex flex-col items-start text-gray-800">
            <span class="text-6xl font-bold italic">Winkle</span>
            <span class="text-sm ml-1">Gerenciador de Senhas</span>
          </div>
        </router-link>
      </div>
      <div
        class="
          mt-10
          px-12
          sm:px-24
          md:px-48
          lg:px-12 lg:mt-16
          xl:px-24 xl:max-w-2xl
        "
      >
        <h2
          class="
            text-center text-4xl text-gray-800
            font-display font-semibold
            lg:text-left
            xl:text-5xl xl:text-bold
          "
        >
          {{ title }}
        </h2>
        <div class="mt-12">
          <slot></slot>
          <div
            class="
              mt-12
              text-sm
              font-display font-semibold
              text-gray-700 text-center
            "
          >
            {{ $t('login.no-account') }}
            <a
              class="cursor-pointer text-indigo-600 hover:text-indigo-800"
              href="https://www.winkle.com.br"
              targett="_blank"
            >
              {{ $t('login.sign-up') }}
            </a>
          </div>
        </div>
      </div>
    </div>
    <div
      class="
        hidden
        lg:flex
        items-center
        justify-center
        flex-1
        h-screen
      "
    >
      <div
        class="max-w-xs transform duration-200 hover:scale-110 cursor-pointer"
      >
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