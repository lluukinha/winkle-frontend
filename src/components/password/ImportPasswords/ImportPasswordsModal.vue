<script setup lang="ts">
import { Ref, ref } from 'vue';
import { IImportedPassword } from '../../../repositories/passwords/IImportedPassword';
import PasswordRepository from '../../../repositories/passwords/PasswordRepository';
import AES from '../../../scripts/AES';
import WinkleScripts from '../../../scripts/WinkleScripts';
import Modal from '../../shared/Modal.vue';
import ImportPasswordsList from './ImportPasswordsList.vue';
const fileInput: Ref<HTMLFormElement | undefined> = ref();
const importedList: Ref<IImportedPassword[]> = ref([]);
const submitButton: Ref<HTMLElement | undefined> = ref();

const csvToArray = (str: string, delimiter = ',') : IImportedPassword[] | undefined => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  if (
    !headers.includes('name') ||
    !headers.includes('url') ||
    !headers.includes('username') ||
    !headers.includes('password')
  ) {
    console.log('erro');
    return undefined;
  }

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object: any, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
    el.isShowingPassword = false;
    return el;
  });

    // return the array
    return arr;
  }

const sendFile = (e: Event) => {
  e.preventDefault();
  if (!fileInput.value || !fileInput.value.files[0]) return;
  const file = fileInput.value.files[0];
  const reader = new FileReader();
  WinkleScripts.setLoading(true);
  reader.readAsText(file);

  reader.onload = (e) => {
    if (!e.target || !e.target.result) return;
    const data = csvToArray(e.target.result.toString());
    if (!data) return;
    importedList.value = data;
  };

  reader.onloadend = () => WinkleScripts.setLoading(false);
  reader.onerror = () => WinkleScripts.setLoading(false);
};

const importList = () => {
  console.log('vrau');
};
</script>

<template>
  <Modal
    :saveLabel="importedList.length === 0 ? 'Importar' : undefined"
    @save="importedList.length === 0 ? submitButton?.click() : importList()"
    size="2xl"
  >
      <h1 class="uppercase text-xl font-bold">Importar senhas</h1>
      <template v-if="importedList.length === 0">
        <p class="text-justify my-4">
          Se você tem as senhas salvas no seu navegador,
          você por exportá-las e importar o arquivo diretamente aqui.
          Vamos criptografar todos os logins e senhas
          e incluir no sistema.
        </p>
        <form @submit="sendFile">
          <input type="file" ref="fileInput" accept=".csv" required />
          <br />
          <button ref="submitButton"></button>
        </form>
      </template>
      <ImportPasswordsList :list="importedList" v-else />
  </Modal>
</template>