<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";

import EditPasswordModal from "../../components/password/EditPasswordModal.vue";
import PasswordCard from "../../components/password/PasswordCard.vue";
import CreatePasswordModal from "../../components/password/CreatePasswordModal.vue";

import { showNotification } from "../../scripts/NotificationScript";
import i18n from "../../scripts/internacionalization/i18n";
import showErrorMessage from "../../scripts/ErrorLogs";

const { t } = i18n.element.global;
const passwords: Ref<IPassword[]> = ref([]);
const editingPassword: Ref<IPassword | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);
const filter : Ref<string> = ref('');
const filteredPasswords = computed(() => {
  if (!filter.value || filter.value === '') return passwords.value;
  return passwords.value.filter(p => p.name.search(filter.value) > -1 || p.url.search(filter.value) > -1);
});

const getPasswords = () => {
  WinkleScripts.setLoading(true);
  PasswordRepository.getPasswords()
    .then((passwordList: IPassword[]) => {
      passwords.value = passwordList;
    })
    .catch(showErrorMessage)
    .finally(() => {
      WinkleScripts.setLoading(false);
    });
};

const includePasswordInList = (password: IPassword) => {
  passwords.value.push(password);
  isCreating.value = false;
  showNotification(t('passwords.created'), password.name, 'success');
};

const changePasswordInList = (password: IPassword) => {
  const index = passwords.value.findIndex((p) => p.id === password.id);
  passwords.value[index] = password;
  editingPassword.value = null;
  showNotification(t('passwords.updated'), password.name, 'success');
};

const removePasswordFromList = (passwordId: number) => {
  const index = passwords.value.findIndex((p) => Number(p.id) === passwordId);
  passwords.value.splice(index, 1);
  showNotification(t('passwords.removed'), '', 'success');
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
  <button
    class="
      py-2 px-3
      text-xs leading-3
      rounded-full
      text-gray-700 bg-gray-300 hover:bg-gray-400
      shadow
      flex items-center
      fixed bottom-6 right-6
    "
    type="button"
    @click="isCreating = true"
    :title="$t('passwords.create')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
    </svg>
  </button>
  <div class="header text-left flex justify-between mb-4 items-center">
    <div>
      <h1 class="text-2xl">{{ $t('passwords.title') }}</h1>
      <h2 class="text-md">{{ $t('passwords.description') }}</h2>
    </div>
    <div>
      <input
        type="text"
        class="rounded w-full text-center bg-gray-50 border focus:border-gray-100 p-2"
        v-model="filter"
        :placeholder="$t('search')"
      />
    </div>
  </div>
  <hr />

  <div
    class="mt-2 text-gray-400"
    v-if="filteredPasswords.length === 0"
  >
    <p v-if="filter.length === 0">
      {{ $t('passwords.empty-list') }}
      <span
        class="hover:text-gray-500 cursor-pointer"
        @click="isCreating = true"
      >
        {{ $t('passwords.clicking-here') }}
      </span>
    </p>
    <p v-if="filter.length > 0">{{ $t('passwords.empty-filtered-list', { filter }) }}</p>
  </div>

  <div class="flex items-center justify-center w-full mt-4 flex-wrap" v-else>
    <PasswordCard
      v-for="password in filteredPasswords"
      :key="password.id"
      :password="password"
      @edit="editingPassword = password"
      @remove="removePasswordFromList"
    />
  </div>
</template>
