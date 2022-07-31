<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Loading from "./components/shared/Loading.vue";
import { onMounted } from "vue";
import i18n from "./scripts/internacionalization/i18n";
const { t } = i18n.element.global;

const changeTitle = () => {
  document.title = t('browser.title');
};

onMounted(() => changeTitle());
</script>

<template>
  <router-view></router-view>
  <Loading />
  <notifications position="top center" class="mt-4" />
</template>

<style lang="postcss">
#app {
  @apply font-sans;
}
</style>

