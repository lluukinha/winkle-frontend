<script setup lang="ts">
import Modal from "../shared/Modal.vue";
import { Ref, ref } from "vue";
import WinkleScripts from "../../scripts/WinkleScripts";
import showErrorMessage from "../../scripts/ErrorLogs";
import { IFolder } from "../../repositories/folder/IFolder";
import PasswordStore from "../../store/passwords/PasswordStore";
// import { IPassword } from "../../repositories/passwords/IPassword";
// import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import UserForm from "./UserForm.vue";

const emit = defineEmits(["close", "save"]);

const userForm = ref();

const handleClose = () => { emit("close"); };
const handleSave = () => {

};
</script>

<template>
  <Modal @close="handleClose()" @save="userForm.sendForm()">
    <h2 class="text-xl font-bold pb-4 uppercase">
      {{ $t('users.create') }}
    </h2>
    <UserForm ref="userForm" @save="handleSave" />
  </Modal>
</template>