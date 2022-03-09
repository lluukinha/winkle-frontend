<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { IFolder } from '../../repositories/folder/IFolder';
import PasswordRepository from '../../repositories/passwords/PasswordRepository';
import showErrorMessage from '../../scripts/ErrorLogs';
import i18n from '../../scripts/internacionalization/i18n';
import { showError } from '../../scripts/NotificationScript';
import WinkleScripts from '../../scripts/WinkleScripts';
import PasswordStore from '../../store/passwords/PasswordStore';
import Modal from '../shared/Modal.vue';

const emit = defineEmits(['close', 'save']);

const { t } = i18n.element.global;
const formSubmit: Ref<HTMLElement | undefined> = ref();
const firstInput : Ref<HTMLElement | undefined> = ref();
const folderName : Ref<string> = ref('');

const clearForm = () => {
  folderName.value = '';
  firstInput.value?.focus();
};

const formHasErrors = () : boolean => {
  const errors = 'passwords.folder-form.errors';
  if (folderName.value === '') {
    showError(t('api-errors.title'), t(`${errors}.not-found`));
    clearForm();
    return true;
  }

  if (folderName.value.length < 3) {
    showError(t('api-errors.title'), t(`${errors}.name-too-short`));
    clearForm();
    return true;
  }

  const folderNames = PasswordStore.foldersList.value.map(f => f.name.toUpperCase());
  folderName.value = folderName.value.toUpperCase();
  if (folderNames.includes(folderName.value)) {
    showError(t('api-errors.title'), t(`${errors}.already-exists`));
    clearForm();
    return true;
  }

  return false;
};

const handleSave = (e: Event) => {
  e.preventDefault();
  if (formHasErrors()) return;

  WinkleScripts.setLoading(true);
  PasswordRepository.createFolder(folderName.value)
    .then((newFolder: IFolder) => { emit('save', newFolder); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};

onMounted(() => { firstInput.value?.focus(); });
</script>

<template>
  <Modal @close="$emit('close')" @save="formSubmit?.click()">
    <h2 class="text-xl font-bold pb-4 uppercase">
      {{ $t('passwords.create-folder') }}
    </h2>

    <form ref="form" class="w-full" autocomplete="off" @submit="handleSave">
      <button type="submit" class="hidden" ref="formSubmit"></button>
      <div class="md:flex md:items-center">
        <div class="md:w-1/3">
          <label for="inline-name">
            {{ $t("passwords.form.name") }} *
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            ref="firstInput"
            id="inline-name"
            type="text"
            v-model="folderName"
            required
            :placeholder="$t('passwords.folder-form.name-placeholder')"
          />
        </div>
      </div>
    </form>
  </Modal>
</template>

<style lang="postcss" scoped>
input {
  @apply  bg-gray-200 dark:bg-gray-500
          appearance-none
          border-2 border-gray-200 dark:border-gray-600
          rounded
          w-full py-2 px-4
          text-gray-700 dark:text-gray-200
          leading-tight uppercase
          focus:outline-none focus:bg-white focus:border-purple-500
          dark:focus:bg-gray-400 dark:focus:border-purple-800
          dark:focus:text-gray-800;
}
</style>
