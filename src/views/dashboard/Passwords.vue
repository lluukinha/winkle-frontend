<script setup lang="ts">
import { onMounted, computed, Ref, ref } from "vue";
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
const header : Ref<HTMLElement | null> = ref(null);
const navbarHeight : Ref<number> = ref(0);
const contentHeight = computed(() => {
  const headerHeight = header.value?.clientHeight || 0;
  return headerHeight + navbarHeight.value - 20;
});
const filteredPasswords = computed(() => {
  if (!filter.value || filter.value === '') return passwords.value;
  return passwords.value
    .filter((p) => {
      const containsName = p.name.toLowerCase().search(filter.value.toLowerCase()) > -1;
      const containsUrl = p.url.toLowerCase().search(filter.value.toLowerCase()) > -1;
      return containsName || containsUrl;
    });
});

onMounted(() => {
  const el = document.getElementById('navbar');
  navbarHeight.value = el?.clientHeight || 0;
})

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

onMounted(() => { getPasswords(); });
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
  <div class="header border-b pb-4 border-gray-300 px-8" ref="header">
    <div class="header-top flex justify-between mb-2">
      <h1 class="text-2xl font-bold">{{ $t('passwords.title') }}</h1>
      <div class="flex border-b items-center ml-10">
        <label for="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
        <input
          id="search-input"
          type="text"
          class="
            ml-4
            bg-gray-50
            border border-none border-b-2
            focus:border-none
            w-20 lg:w-72
            !outline-none
          "
          v-model="filter"
          :placeholder="$t('passwords.search')"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="header-bottom flex justify-between items-center text-left">
      <h2 class="text-md">{{ $t('passwords.description') }}</h2>
      <div class="ml-4">
        <button
          class="
            bg-gray-500 hover:bg-gray-700
            text-gray-200
            py-1 px-2
            border border-gray-200
            rounded
            shadow
          "
          @click="isCreating = true"
          :title="$t('passwords.create')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div
    class="overflow-auto px-8"
    :style="{ height: `calc(100% - (${contentHeight}px))` }"
  >

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
  </div>
</template>
