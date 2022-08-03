<script setup lang="ts">
import { ref, Ref } from 'vue';
import { IUserForm } from "../../repositories/user/UserInterfaces";
const emit = defineEmits(["save"]);
const formSubmit: Ref<HTMLElement | undefined> = ref();
const sendForm = () => { formSubmit.value?.click(); };
defineExpose({ sendForm });

const handleSave = (e: Event) => {
  e.preventDefault();
  if (user.value.plan === 0) {
    planSelect.value.focus();
    return;
  }
  emit('save', user.value);
};

const user: Ref<IUserForm> = ref({
  name: '',
  email: '',
  plan: 0,
  admin: false
});

const plans = [
  { id: 1, name: 'Mensal' },
  { id: 2, name: 'Anual' },
  { id: 5, name: 'Vitalicio' }
];

const planSelect = ref();
</script>

<template>
  <form ref="form" class="w-full" autocomplete="off" @submit="handleSave">
    <button type="submit" class="hidden" ref="formSubmit"></button>
    <div class="md:flex md:items-center mt-4 mb-6">
      <div class="md:w-1/3">
        <label for="inline-user-name">
          {{ $t("users.form.name") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          id="inline-user-name"
          :placeholder="$t('users.form.name-placeholder')"
          class="input"
          type="text"
          v-model="user.name"
          required
        />
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-user-email">
          {{ $t("users.form.email") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          class="input"
          id="inline-user-email"
          type="email"
          v-model="user.email"
          :placeholder="$t('users.form.email-placeholder')"
          required
        />
      </div>
    </div>

    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label for="inline-user-plan">
          {{ $t("users.form.plan") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <select id="inline-user-plan" ref="planSelect" v-model="user.plan" required>
          <option :value="0" disabled>
            {{ $t("users.form.plan-placeholder") }}
          </option>
          <option
            v-for="plan in plans"
            :key="plan.id"
            :value="plan.id"
          >
            {{ plan.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="md:flex md:items-center mb-4">
      <div class="md:w-1/3">
        <label for="inline-user-admin">
          {{ $t("users.form.admin") }}
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          id="inline-user-admin"
          type="checkbox"
          v-model="user.admin"
          :checked="user.admin"
          class="float-left w-6 h-6 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  </form>
</template>

<style lang="postcss" scoped>
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

.input, select, textarea {
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