<script setup lang="ts">
import { Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import Alert from "../../scripts/Alert";

const passwords : Ref<IPassword[]> = ref([]);

const getPasswords = () => {
  PasswordRepository.getPasswords()
    .then(({ data }) => {
      console.log(data);
      passwords.value = data;
    })
    .catch((errors) => { console.log(errors); });
};

const copy = (title: string, textToCopy: string) : void => {
  navigator.clipboard.writeText(textToCopy);
  Alert.showWarning(`${title} copied`, 'text copied to your clipboard', 1000);
}

getPasswords();
</script>

<template>
  <div
    class="bg-white rounded-3xl border shadow-xl p-6 w-full md:w-3/6"
    v-for="password in passwords"
    :key="password.id"
  >
    <div>
      <h1 class="font-semibold text-xl text-gray-700">{{ password.name }}</h1>
      <h3 class="font-semibold text-sm text-gray-400">{{ password.url }}</h3>
    </div>
    <div class="mt-2 text-xs">
      <button class="bg-slate-300 p-1 rounded mr-2" @click="copy('Username', password.login)">
        Copy username
      </button>
      <button class="bg-slate-300 p-1 rounded" @click="copy('Password', password.password)">
        Copy password
      </button>
    </div>
  </div>
</template>
