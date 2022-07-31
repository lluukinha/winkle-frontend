<script lang="ts" setup>
import i18n from "../../scripts/internacionalization/i18n";
const { t } = i18n.element.global;

const changeLanguage = (event: Event) => {
  const newLang = (event.target as HTMLInputElement).value;
  localStorage.lang = newLang;
  document.title = t('browser.title');
};
</script>

<template>
  <select
    v-model="$i18n.locale"
    class="border-gray-200 text-gray-800 dark:text-white uppercase ml-4 cursor-pointer hover:underline"
    @change="changeLanguage"
  >
    <option
      v-for="locale in $i18n.availableLocales"
      :key="`locale-${locale}`"
      :value="locale"
      class="uppercase"
    >
      {{ locale }}
    </option>
  </select>
</template>