<script setup lang="ts">
import { ref } from "vue";
import router from "../router";
import LoginRepository from "../repositories/login/LoginRepository";
import PasswordRepository from "../repositories/passwords/PasswordRepository";

const passwords = ref([]);

const mount = () : void => {
  if (!LoginRepository.canUseLoginInfo) {
    router.push("/login");
    return;
  }

  getPasswords();
};

const getPasswords = () => {
  PasswordRepository.getPasswords()
    .then(({ data }) => {
      console.log(data);
      passwords.value = data;
    })
    .catch((errors) => { console.log(errors); });
};

mount();
</script>

<template>
  <div>Welcome to Dashboard</div>
  {{ passwords }}
</template>