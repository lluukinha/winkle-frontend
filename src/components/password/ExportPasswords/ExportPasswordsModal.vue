<script setup lang="ts">
import Papa from 'papaparse';
import PasswordStore from '../../../store/passwords/PasswordStore';
import Modal from '../../shared/Modal.vue';

const emit = defineEmits(['close']);

const exportToCsv = () => {
  const passwordsList: {
    name: string;
    login: string;
    password: string;
    folder: string;
    description: string;
    url: string;
  }[] = [];

  PasswordStore.passwordsList.value.forEach((password) => {
    const passwordElement = {
      name: password.name,
      login: password.login,
      password: password.password,
      folder: password.folder.name,
      description: password.description,
      url: password.url,
    };
    passwordsList.push(passwordElement);
  });

  const sortedList = passwordsList.sort((a, b) => {
    if (a.folder < b.folder) return -1;
    if (a.folder > b.folder) return 1;

    // Folders are the same, sort by name
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 0;
  });

  const csv = Papa.unparse(sortedList);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'passwords.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  emit('close');
};
</script>

<template>
  <Modal
    :saveLabel="'Exportar'"
    @close="$emit('close')"
    @save="exportToCsv"
    size="md:max-w-3xl"
  >
    <h1 class="uppercase text-xl font-bold">Exportar senhas</h1>
    Voce está prestes a exportar suas
    {{ PasswordStore.passwordsList.value.length }} senhas para um arquivo CSV.
    <br /><br />
    Se você chegou até aqui, saiba que é com muita tristeza que disponibilizo o
    download de suas senhas.
    <br />
    Infelizmente o Winkle vai ser desativado em breve e gostaria de providenciar
    uma forma de extrair suas senhas para que você não as perdesse.
    <br /><br />
    Obrigado por confiar na nossa plataforma por tanto tempo.
  </Modal>
</template>
