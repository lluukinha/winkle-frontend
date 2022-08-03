<script setup lang="ts">
import Modal from "../shared/Modal.vue";
import { ref } from "vue";
import WinkleScripts from "../../scripts/WinkleScripts";
import showErrorMessage from "../../scripts/ErrorLogs";
import UserForm from "./UserForm.vue";
import { IUser, IUserForm } from "../../repositories/user/UserInterfaces";
import UserRepository from "../../repositories/user/UserRepository";

const emit = defineEmits(["close", "save"]);
const userForm = ref();
const handleClose = () => { emit("close"); };
const handleSave = (user: IUserForm) => {
  WinkleScripts.setLoading(true);
  UserRepository.createUser(user)
    .then((newUser : IUser) => { emit("save", newUser); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
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