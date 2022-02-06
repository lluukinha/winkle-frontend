<script setup lang="ts">
import { Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import LoadingScript from "../../scripts/LoadingScript";

import EditPasswordModal from "../../components/password/EditPasswordModal.vue";
import PasswordCard from "../../components/password/PasswordCard.vue";
import CreatePasswordModal from "../../components/password/CreatePasswordModal.vue";

const passwords: Ref<IPassword[]> = ref([]);
const editingPassword: Ref<IPassword | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);

const getPasswords = () => {
  LoadingScript.setLoading(true);
  PasswordRepository.getPasswords()
    .then((passwordList: IPassword[]) => {
      passwords.value = passwordList;
    })
    .catch((errors) => {
      console.log(errors);
    })
    .finally(() => {
      LoadingScript.setLoading(false);
    });
};

const includePasswordInList = (password: IPassword) => {
  passwords.value.push(password);
  isCreating.value = false;
};

const changePasswordInList = (password: IPassword) => {
  const index = passwords.value.findIndex((p) => p.id === password.id);
  passwords.value[index] = password;
  editingPassword.value = null;
};

const removePasswordFromList = (passwordId: number) => {
  const index = passwords.value.findIndex((p) => Number(p.id) === passwordId);
  passwords.value.splice(index, 1);
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
  <CreatePasswordModal
    v-if="isCreating"
    @close="isCreating = false"
    @save="includePasswordInList"
  />
  <div class="header text-left flex justify-between mb-4">
    <div>
      <h1 class="text-2xl">{{ $t('passwords.title') }}</h1>
      <h2 class="text-md">{{ $t('passwords.description') }}</h2>
    </div>
    <div>
      <button
        class="
          py-2
          px-3
          text-xs
          leading-3
          rounded-full
          text-gray-700
          bg-gray-300
          hover:bg-gray-400
          shadow
          flex
          items-center
        "
        type="button"
        @click="isCreating = true"
        :title="$t('passwords.create')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  </div>
  <hr />

  <div class="lg:flex items-center justify-center w-full mt-4">
    <PasswordCard
      v-for="password in passwords"
      :key="password.id"
      :password="password"
      @edit="editingPassword = password"
      @remove="removePasswordFromList"
    />
  </div>
</template>
