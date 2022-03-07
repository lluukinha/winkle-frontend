<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { IImportedPassword } from '../../../repositories/passwords/IImportedPassword';
import { IImportedPasswordResponse } from '../../../repositories/passwords/IImportedPasswordResponse';
import PasswordRepository from '../../../repositories/passwords/PasswordRepository';
import showErrorMessage from '../../../scripts/ErrorLogs';
import WinkleScripts from '../../../scripts/WinkleScripts';
import Modal from '../../shared/Modal.vue';
import ImportPasswordsList from './ImportPasswordsList.vue';
import i18n from '../../../scripts/internacionalization/i18n';
import { showError } from '../../../scripts/NotificationScript';
import PasswordStore from '../../../store/passwords/PasswordStore';

const { t } = i18n.element.global;
const form: Ref<HTMLFormElement | undefined> = ref();
const fileInput: Ref<HTMLFormElement | undefined> = ref();
const importedList: Ref<IImportedPassword[]> = ref([]);
const submitButton: Ref<HTMLElement | undefined> = ref();
interface PasswordResponseCounter {
  created: number;
  updated: number;
}
const importResult: Ref<PasswordResponseCounter | undefined> = ref();

const notInsertedPasswords = computed(() => {
  if (!importResult.value || importedList.value.length === 0) return 0;
  const { created, updated } = importResult.value;
  return importedList.value.length - (created + updated);
});

const emit = defineEmits(['close','save']);

const sendFile = (e: Event) => {
  e.preventDefault();
  if (!fileInput.value || !fileInput.value.files[0]) return;
  const file = fileInput.value.files[0];
  const reader = new FileReader();
  WinkleScripts.setLoading(true);
  reader.readAsText(file);

  reader.onload = (e) => {
    if (!e.target || !e.target.result) return;
    const data = WinkleScripts.csvToArray(e.target.result.toString());
    if (!data) {
      form.value?.reset();
      return;
    }
    importedList.value = data.map(password => {
      const existing = PasswordStore.passwordsList.value
        .find(p => p.name === password.name);

      if (existing) password.folderName = existing.folder.name;
      return password;
    });
  };

  reader.onloadend = () => WinkleScripts.setLoading(false);
  reader.onerror = () => WinkleScripts.setLoading(false);
};

const importList = () => {
  WinkleScripts.setLoading(true);
  PasswordRepository.importCsv(importedList.value)
    .then((result: IImportedPasswordResponse) => {
      const counter =  {
        created: Object.keys(result.created).length,
        updated: Object.keys(result.updated).length
      };
      PasswordStore.includeMany(result.created);
      PasswordStore.updateMany(result.updated);
      importResult.value = counter;
      emit('save');
    })
    .catch(showErrorMessage)
    .finally(() => WinkleScripts.setLoading(false));
};
</script>

<template>
  <Modal
    :saveLabel="importedList.length === 0 ? 'Importar' : undefined"
    :removeSave="!!importResult"
    @close="$emit('close')"
    @save="importedList.length === 0 ? submitButton?.click() : importList()"
    size="md:max-w-3xl"
  >
    <h1 class="uppercase text-xl font-bold">
      <template v-if="importResult">{{ $t('passwords.import.finished-title') }}</template>
      <template v-else>{{ $t('passwords.import.title') }}</template>
    </h1>

    <div
      v-if="importResult"
      class="w-full flex justify-around items-center my-10"
    >
      <div class="bg-green-200 rounded p-4 shadow-lg">
        <h1 class="text-7xl">{{ importResult.created }}</h1>
        <p class="text-xl mt-4">{{ $t('passwords.import.created') }}</p>
      </div>
      <div class="bg-indigo-100 rounded p-4 shadow-lg">
        <h1 class="text-7xl">{{ importResult.updated }}</h1>
        <p class="text-xl mt-4">{{ $t('passwords.import.updated') }}</p>
      </div>
      <div class="bg-red-200 rounded p-4 shadow-lg">
        <h1 class="text-7xl">{{ notInsertedPasswords }}</h1>
        <p class="text-xl mt-4">{{ $t('passwords.import.not-inserted') }}</p>
        <p class="text-sm">{{ $t('passwords.import.not-inserted-description') }}</p>
      </div>
    </div>

    <template v-else-if="importedList.length === 0">
      <p class="text-justify my-4">{{ $t('passwords.import.description') }}</p>
      <form ref="form" @submit="sendFile">
        <input type="file" ref="fileInput" accept=".csv" required />
        <button ref="submitButton"></button>
      </form>
    </template>

    <ImportPasswordsList :list="importedList" v-else />
  </Modal>
</template>