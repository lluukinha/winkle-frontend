<script setup lang="ts">
import { Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import Alert from "../../scripts/Alert";

import EditPasswordModal from "../../components/password/EditPasswordModal.vue";

const passwords: Ref<IPassword[]> = ref([]);
const editingPassword: Ref<IPassword | null> = ref(null);

const getPasswords = () => {
  PasswordRepository.getPasswords()
    .then(({ data }) => {
      console.log(data);
      passwords.value = data;
    })
    .catch((errors) => {
      console.log(errors);
    });
};

const copy = (title: string, textToCopy: string): void => {
  navigator.clipboard.writeText(textToCopy);
  Alert.showWarning(`${title} copied`, "text copied to your clipboard", 1000);
};

const changePasswordInList = (password: IPassword) => {
  const index = passwords.value.findIndex(p => p.id === password.id);
  passwords.value[index] = password;
  editingPassword.value = null;
};

getPasswords();
</script>

<template>
  <EditPasswordModal
    v-if="editingPassword"
    :password="editingPassword"
    @close="editingPassword = null"
    @save="changePasswordInList"
  />
  <div class="header text-left flex justify-between mb-4">
    <div>
      <h1 class="text-2xl">Passwords</h1>
      <h2 class="text-md">All your passwords here</h2>
    </div>
    <div>
      <button class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Toggle modal
      </button>
    </div>
  </div>
  <hr />

  <div class="mt-4">
    <div
      class="bg-white rounded-3xl border shadow-xl p-6 w-full md:w-3/6 lg:w-2/6"
      v-for="password in passwords"
      :key="password.id"
    >
      <div @click="editingPassword = password">
        <h1 class="font-semibold text-xl text-gray-700">{{ password.name }}</h1>
        <h3 class="font-semibold text-sm text-gray-400">{{ password.url }}</h3>
      </div>
      <div class="mt-2 text-xs">
        <button
          class="bg-slate-300 p-1 rounded mr-2"
          @click="copy('Username', password.login)"
        >
          Copy username
        </button>
        <button
          class="bg-slate-300 p-1 rounded"
          @click="copy('Password', password.password)"
        >
          Copy password
        </button>
      </div>
    </div>
  </div>
</template>
