<script setup lang="ts">
import router from '../router';
import { onMounted } from "@vue/runtime-core";

onMounted(() => {
  router.push({ name: 'login'});
})
</script>

<template>
  <div
    class="
      h-screen
      w-screen
      flex
      justify-center
      items-center bg-gradient-to-br from-gray-600 to-gray-900
      flex-col
    "
  >
    <h1 class="text-gray-50 text-4xl">{{ $t('wait') }}...</h1>
    <h4 class="text-gray-300 text-sm mt-4">
      {{ $t('not-redirected-message') }}
      <router-link :to="{ name: 'login' }" class="hover:underline">
        {{ $t('click-here') }}
      </router-link>
    </h4>
  </div>
</template>


<style>
#app {
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
