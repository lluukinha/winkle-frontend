<script setup lang="ts">import { ref, Ref } from 'vue';

const emit = defineEmits(["save"]);

const handleSave = (e: Event) => {
  e.preventDefault();
  emit('save', user.value);
};

const formSubmit: Ref<HTMLElement | undefined> = ref();
const sendForm = () => { formSubmit.value?.click(); };

const user: Ref = ref({
  name: '',
  email: '',
  plan: '',
  admin: false
});
</script>

<template>
  <form ref="form" class="w-full" autocomplete="off" @submit="handleSave">
    <button type="submit" class="hidden" ref="formSubmit"></button>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-name">
          {{ $t("passwords.form.name") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          id="inline-full-name"
          type="text"
          v-model="user.name"
          required
          :placeholder="$t('passwords.form.name-placeholder')"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-full-name">
          {{ $t("passwords.form.name") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          id="inline-full-name"
          type="text"
          v-model="user.email"
          required
          :placeholder="$t('passwords.form.name-placeholder')"
        />
      </div>
    </div>
  </form>
</template>

<style lang="postcss">
label {
  @apply block text-gray-500 dark:text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4
}

.span-button {
  @apply  cursor-pointer
          bg-gray-200 dark:bg-gray-600
          hover:bg-gray-400 dark:hover:bg-gray-800
          flex items-center px-4
          select-none
          rounded rounded-tl-none rounded-bl-none;
}

input, select, textarea {
  @apply  bg-gray-200 dark:bg-gray-500
            appearance-none
            border-2 border-gray-200 dark:border-gray-600
            rounded
            w-full py-2 px-4
            text-gray-700 dark:text-gray-200
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
            dark:focus:bg-gray-400 dark:focus:border-purple-800
            dark:focus:text-gray-800;
}
</style>