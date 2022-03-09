<script setup lang="ts">
import Modal from "../shared/Modal.vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { ref } from "@vue/reactivity";
import { Ref } from "vue";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import showErrorMessage from "../../scripts/ErrorLogs";
import PasswordForm from "./PasswordForm.vue";
import PasswordStore from "../../store/passwords/PasswordStore";
import { IFolder } from "../../repositories/folder/IFolder";
const props = defineProps<{ password: IPassword }>();
const emit = defineEmits(["close", "save"]);

const passwordForm: Ref<any> = ref();
const handleClose = () => { emit("close"); };
const handleSave = (updatedPassword: IPassword) => {
  const { url } = updatedPassword;
  const willChange : boolean = url.trim().length > 0 && !url.startsWith('http');
  if (willChange) updatedPassword.url = `https://${url}`;

  const folderName = updatedPassword.folder.name;
  if (folderName !== '') {
    updatedPassword.folder.name = updatedPassword.folder.name.toUpperCase();
    const currentFolder = PasswordStore.foldersList.value
      .find((f: IFolder) => f.name.toUpperCase() === folderName.toUpperCase());
    updatedPassword.folder.id = currentFolder?.id || '';
  }

  WinkleScripts.setLoading(true);
  PasswordRepository.updatePassword(updatedPassword)
    .then((newPassword: IPassword) => { emit("save", newPassword); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};
</script>

<template>
  <Modal @close="handleClose()" @save="passwordForm.sendForm()">
    <h2 class="text-xl font-bold pb-4 uppercase">{{ $t("passwords.edit") }}</h2>
    <PasswordForm
      ref="passwordForm"
      :newPassword="{ ...password }"
      @save="handleSave"
    />
  </Modal>
</template>