<script setup lang="ts">
import { onMounted, computed, Ref, ref, watch } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { IFolder } from "../../repositories/folder/IFolder";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";
import i18n from "../../scripts/internacionalization/i18n";
import { showNotification } from "../../scripts/NotificationScript";

import EditPasswordModal from "../../components/password/EditPasswordModal.vue";
import PasswordCard from "../../components/password/PasswordCard.vue";
import CreatePasswordModal from "../../components/password/CreatePasswordModal.vue";
import DashboardHeader from "../../components/shared/DashboardHeader.vue";
import DashboardContainer from "../../components/shared/DashboardContainer.vue";
import WinkleButton from "../../components/shared/WinkleButton.vue";
import FolderFilterDropdown from "../../components/password/FolderFilterDropdown.vue";
import ImportPasswordsModal from "../../components/password/ImportPasswords/ImportPasswordsModal.vue";
import PasswordStore from "../../store/passwords/PasswordStore";
import RemoveIcon from "../../components/icons/RemoveIcon.vue";

const { t } = i18n.element.global;

const isImportingPasswords: Ref<boolean> = ref(false);
const editingPassword: Ref<IPassword | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);
const filter: Ref<string> = ref("");
const isShowingSortDropdown: Ref<boolean> = ref(false);

const passwordsWithoutFolder = computed(() => {
  return filteredPasswords.value.filter((p) => p.folder.id === '');
});

const filteredFolders = computed(() => {
  if (PasswordStore.selectedFolderIds.value.length === 0) {
    return PasswordStore.foldersList.value;
  }

  return PasswordStore.foldersList.value
    .filter((folder) => PasswordStore.selectedFolderIds.value.includes(folder.id));
});

const filteredPasswords = computed(() => {
  const list = !filter.value || filter.value === ""
    ? PasswordStore.passwordsList.value
    : PasswordStore.passwordsList.value.filter((p) => {
        const filterValue = filter.value.toLowerCase();
        const containsName = p.name.toLowerCase().search(filterValue) > -1;
        const containsUrl = p.url.toLowerCase().search(filterValue) > -1;
        return containsName || containsUrl;
      });
  return list;
});

const filterHasPasswordsInFolder = (folderId: string) => {
  if (filter.value.length === 0) return true;
  return filter.value.length > 0 && passwordsInFolder(folderId).length > 0;
};

const includePasswordInList = (newPassword: IPassword) => {
  isCreating.value = false;
  PasswordStore.includePasswordInList(newPassword);
};

const changePasswordInList = (newPassword: IPassword) => {
  PasswordStore.changePasswordInList(newPassword);
  editingPassword.value = null;
};

const passwordsInFolder = (folderId: string) => {
  return filteredPasswords.value
    .filter(p => p.folder.id === folderId);
};

const saveFoldersFilter = (folderIds: string[]) => {
  PasswordStore.saveFoldersFilter(folderIds);
  isShowingSortDropdown.value = false;
};

onMounted(() => PasswordStore.getAllData());
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
      bg-gray-500 hover:bg-gray-700
      dark:bg-gray-800 dark:hover:bg-gray-900
      text-gray-200
      py-2
      px-2
      border border-gray-200 dark:border-gray-700
      rounded-full
      shadow-lg
      absolute
      bottom-6
      md:bottom-10
      right-6
      md:right-10
    "
    @click="isCreating = true"
    :title="$t('passwords.create')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  </button>
  <DashboardHeader :title="$t('passwords.title')" />

  <DashboardContainer>
    <!-- passwords header /-->
    <div class="w-full flex items-center justify-between md:mt-2 mb-6">
      <div class="flex items-center">
        <WinkleButton
          size="sm"
          @click="isShowingSortDropdown = !isShowingSortDropdown"
          v-if="PasswordStore.foldersList.value.length > 0"
          class="flex items-center mr-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="hidden md:block">
          {{ $t('passwords.folder-filter.title') }}
          </span>
          <template v-if="PasswordStore.selectedFolderIds.value.length > 0">
            ({{ PasswordStore.selectedFolderIds.value.length }})
          </template>
        </WinkleButton>
        <FolderFilterDropdown
          v-if="isShowingSortDropdown"
          @close="isShowingSortDropdown = false"
          @save="saveFoldersFilter"
        />
        <WinkleButton
          class="mr-1 flex items-center"
          size="sm"
          @click="PasswordStore.toggleAllFolders()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
          </svg>
          <span class="hidden md:block">
            {{ $t('passwords.toggle-folders') }}
          </span>
        </WinkleButton>
        <WinkleButton
          class="mr-1 items-center hidden md:flex"
          @click="isImportingPasswords = !isImportingPasswords"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm ml-2">{{ $t('passwords.import.title') }}</span>
        </Winklebutton>
        <ImportPasswordsModal
          v-if="isImportingPasswords"
          @close="isImportingPasswords = false"
          @save="() => {}"
        />
      </div>

      <div
        class="
          md:w-auto flex
          border-b items-center
          bg-gray-100 dark:bg-gray-600 dark:border-gray-600
          rounded px-2 py-1 shadow
        "
      >
        <label for="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
        <input
          id="search-input"
          type="text"
          class="
            ml-4
            bg-gray-100 dark:bg-gray-600
            border border-none border-b-2
            dark:border-gray-600
            focus:border-none
            w-24 md:w-full
            !outline-none
          "
          v-model="filter"
          :placeholder="$t('passwords.search')"
          autocomplete="off"
        />
      </div>
    </div>

    <!-- Without category -->
    <div
      class="w-full mb-4"
      v-if="
        PasswordStore.selectedFolderIds.value.length === 0
        || PasswordStore.selectedFolderIds.value.includes('0')
      "
    >
      <div
        class="
          border-b border-gray-400 dark:border-gray-600
          w-full pb-2
          text-left uppercase select-none cursor-pointer
          dark:text-gray-100
        "
        @click="PasswordStore.emptyFolderIsOpen.value = !PasswordStore.emptyFolderIsOpen.value"
      >
        <button>
          <svg v-if="!PasswordStore.emptyFolderIsOpen.value" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button> {{ $t('passwords.without-folder') }} ({{ passwordsWithoutFolder.length }})
      </div>
      <div class="flex items-center flex-wrap w-full mt-4" v-show="PasswordStore.emptyFolderIsOpen.value">
        <div class="text-gray-400" v-if="passwordsWithoutFolder.length === 0">
          <p class="ml-4">
            <template v-if="filter.length === 0">
              {{ $t("passwords.empty-list") }}
            </template>
            <template v-else>
              {{ $t("passwords.empty-filtered-list", { filter }) }}
            </template>
          </p>
        </div>
        <template v-else>
          <PasswordCard
            v-for="password in passwordsWithoutFolder"
            :key="password.id"
            :password="password"
            @edit="editingPassword = { ...password }"
            @remove="PasswordStore.removePasswordFromList"
          />
        </template>
      </div>
    </div>

    <div
      v-for="folder in filteredFolders"
      :key="folder.id"
      class="w-full my-6"
      :class="{ hidden: !filterHasPasswordsInFolder(folder.id) }"
    >
      <div
        class="
          border-b border-gray-400 dark:border-gray-600
          w-full uppercase select-none cursor-pointer pb-2
          flex justify-between items-center dark:text-gray-100
        "
      >
        <div class="flex items-center" @click="folder.isOpen = !folder.isOpen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!folder.isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <span class="ml-2">
            {{ folder.name }} ({{ passwordsInFolder(folder.id).length }})
          </span>
        </div>

        <button
          class="
            py-2 px-3
            text-xs leading-3
            text-red-700 hover:text-red-500
            dark:text-red-300 hover:text-red-500
            rounded-full flex items-center
          "
          @click="PasswordStore.removeFolder(Number(folder.id))"
          :title="$t('passwords.remove')"
          v-if="passwordsInFolder(folder.id).length === 0"
        >
          <RemoveIcon />
        </button>
      </div>
      <div class="flex items-center flex-wrap w-full mt-4" v-if="folder.isOpen">
        <div
          class="text-gray-400"
          v-if="passwordsInFolder(folder.id).length === 0"
        >
          <p class="ml-4">{{ $t("passwords.folder-is-empty") }}</p>
        </div>
        <PasswordCard
          v-for="password in passwordsInFolder(folder.id)"
          :key="password.id"
          :password="password"
          @edit="editingPassword = { ...password }"
          @remove="PasswordStore.removePasswordFromList"
        />
      </div>
    </div>
  </DashboardContainer>
</template>
