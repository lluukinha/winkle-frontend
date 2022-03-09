<script setup lang="ts">
import Modal from "../shared/Modal.vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { ref } from "@vue/reactivity";
import { Ref } from "vue";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import showErrorMessage from "../../scripts/ErrorLogs";
import { IFolder } from "../../repositories/folder/IFolder";
import PasswordForm from "./PasswordForm.vue";
import PasswordStore from "../../store/passwords/PasswordStore";

const emit = defineEmits(["close", "save"]);
const password : Ref<IPassword> = ref({
  type: 'password',
  id: '',
  name: '',
  description: '',
  login: '',
  password: '',
  url: '',
  folderId: '',
  folder: { id: '', name: '' }
});

const passwordForm = ref();
const isShowingLogin : Ref<Boolean> = ref(false);
const isShowingPassword : Ref<Boolean> = ref(false);

const handleClose = () => { emit("close"); };
const handleSave = (password: IPassword) => {
  const { url } = password;
  const willChange : boolean = url.trim().length > 0 && !url.startsWith('http');
  if (willChange) password.url = `https://${url}`;

  const folderName = password.folder.name;
  if (folderName !== '') {
    password.folder.name = password.folder.name.toUpperCase();
    const currentFolder = PasswordStore.foldersList.value
      .find((f: IFolder) => f.name.toUpperCase() === folderName.toUpperCase());
    password.folder.id = currentFolder?.id || '';
  }

  WinkleScripts.setLoading(true);
  PasswordRepository.createPassword(password)
    .then((newPassword : IPassword) => { emit("save", newPassword); })
    .catch(showErrorMessage)
    .finally(() => { WinkleScripts.setLoading(false); });
};
</script>

<template>
  <Modal @close="handleClose()" @save="passwordForm.sendForm()">
    <h2 class="text-xl font-bold pb-4 uppercase">
      {{ $t('passwords.create') }}
    </h2>
    <PasswordForm ref="passwordForm" @save="handleSave" />
  </Modal>
</template>