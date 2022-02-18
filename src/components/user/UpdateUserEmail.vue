<script setup lang="ts">
import { ref, Ref } from 'vue';
import { IUpdateUserEmail, IUser } from '../../repositories/user/UserInterfaces';
import UserRepository from '../../repositories/user/UserRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import WinkleScripts from '../../scripts/WinkleScripts';
import Modal from '../shared/Modal.vue';

const formSubmit: Ref<HTMLElement | undefined> = ref();

const form: Ref<IUpdateUserEmail> = ref({
  email: '',
  confirmEmail: '',
  password: ''
});

const emit = defineEmits(["close", "save"]);
const handleClose = () => { emit("close"); };
const handleSave = (e: Event) => {
  e.preventDefault();

  WinkleScripts.setLoading(true);
  UserRepository.updateEmail(form.value)
    .then((updatedUser: IUser) => { emit("save", updatedUser); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};

const sendForm = () => { formSubmit.value?.click(); };
</script>

<template>
  <Modal @save="sendForm()" @close="$emit('close')">
  <form @submit="handleSave">
    <button type="submit" class="hidden" ref="formSubmit"></button>
    <!-- user.update-email-form.email|email-confirm|password-->
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
          for="email-input"
        >
          {{ $t("user.update-email-form.email") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          ref="firstInput"
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="email-input"
          type="email"
          v-model="form.email"
          required
          :placeholder="$t('user.update-email-form.email-placeholder')"
        />
      </div>
    </div>


    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
          for="confirm-email-input"
        >
          {{ $t("user.update-email-form.email-confirm") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="confirm-email-input"
          type="email"
          v-model="form.confirmEmail"
          required
          :placeholder="$t('user.update-email-form.email-confirm-placeholder')"
        />
      </div>
    </div>


    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4 "
          for="password-input"
        >
          {{ $t("user.update-email-form.password") }} *
        </label>
      </div>
      <div class="md:w-2/3">
        <input
          class="
            bg-gray-200
            appearance-none
            border-2 border-gray-200
            rounded
            w-full
            py-2
            px-4
            text-gray-700
            leading-tight
            focus:outline-none focus:bg-white focus:border-purple-500
          "
          id="password-input"
          type="password"
          v-model="form.password"
          required
          :placeholder="$t('user.update-email-form.password-placeholder')"
        />
      </div>
    </div>
  </form>
  </Modal>
</template>