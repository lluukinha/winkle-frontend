<script setup lang="ts">
import { onMounted, computed, Ref, ref, watch } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { IFolder } from "../../repositories/passwords/IFolder";
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

interface PasswordIncluded {
  newPassword: IPassword;
  willReloadFolders: boolean;
};

const { t } = i18n.element.global;

const passwords: Ref<IPassword[]> = ref([]);
const folders: Ref<IFolder[]> = ref([]);
const emptyFolderIsOpen: Ref<boolean> = ref(true);
const editingPassword: Ref<IPassword | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);
const filter: Ref<string> = ref("");
const selectedFolderIds: Ref<string[]> = ref([]);
const isShowingSortDropdown: Ref<boolean> = ref(false);

const passwordsWithoutFolder = computed(() => {
  return filteredPasswords.value.filter((p) => p.folder.id === '');
});

const filteredFolders = computed(() => {
  if (selectedFolderIds.value.length === 0) return folders.value;

  return folders.value
    .filter((folder) => selectedFolderIds.value.includes(folder.id));
});

const filteredPasswords = computed(() => {
  const list = !filter.value || filter.value === ""
    ? passwords.value
    : passwords.value.filter((p) => {
        const filterValue = filter.value.toLowerCase();
        const containsName = p.name.toLowerCase().search(filterValue) > -1;
        const containsUrl = p.url.toLowerCase().search(filterValue) > -1;
        return containsName || containsUrl;
      });
  return list.sort(sortByName);
});

const loadFolders = async (foldersList: IFolder[] | undefined) => {
  WinkleScripts.setLoading(true);
  if (!foldersList) foldersList = await PasswordRepository.getFolders();
  folders.value = foldersList.sort(sortByName);
  const folderIds: string[] = foldersList.map(f => f.id);
  selectedFolderIds.value = selectedFolderIds.value.filter(id => folderIds.includes(id));
  WinkleScripts.setLoading(false);
};

const sortByName = (a: IPassword | IFolder, b: IPassword | IFolder) => {
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
};

const getData = async () => {
  WinkleScripts.setLoading(true);
  const foldersList = await PasswordRepository.getFolders();
  const passwordsList = await PasswordRepository.getPasswords();
  passwords.value = passwordsList;
  folders.value = foldersList.sort(sortByName);
  WinkleScripts.setLoading(false);
};

const includePasswordInList = (e: PasswordIncluded) => {
  passwords.value.push(e.newPassword);
  isCreating.value = false;
  showNotification(t('passwords.created'), e.newPassword.name, 'success');
  if (e.willReloadFolders) loadFolders(undefined);
};

const changePasswordInList = (e: PasswordIncluded) => {
  const index = passwords.value.findIndex((p) => p.id === e.newPassword.id);
  passwords.value[index] = { ...e.newPassword };
  editingPassword.value = null;
  showNotification(t('passwords.updated'), e.newPassword.name, 'success');
  if (e.willReloadFolders) loadFolders(undefined);
};

const removePasswordFromList = (passwordId: number, foldersList: IFolder[]) => {
  const index = passwords.value.findIndex((p) => Number(p.id) === passwordId);
  if (index > -1) passwords.value.splice(index, 1);
  showNotification(t('passwords.removed'), '', 'success');
  if (foldersList.length > 0) loadFolders(foldersList);

  if (folders.value.length === 1) {
    const folder = folders.value[0];
    if (passwordsInFolder(folder.id).length === 0) folders.value = [];
  }
};

const passwordsInFolder = (folderId: string) => {
  return filteredPasswords.value
    .filter(p => p.folder.id === folderId);
};

const saveSorting = (folderIds: string[]) => {
  selectedFolderIds.value = [ ...folderIds ];
  isShowingSortDropdown.value = false;
};

const toggleAllFolders = (willShow: boolean) => {
  emptyFolderIsOpen.value = willShow;
  folders.value.map(f => f.isOpen = willShow);
};

onMounted(() => getData());
</script>

<template>
  <EditPasswordModal
    v-if="editingPassword"
    :password="editingPassword"
    :folders="folders"
    @close="editingPassword = null"
    @save="changePasswordInList"
  />
  <CreatePasswordModal
    v-if="isCreating"
    :folders="folders"
    @close="isCreating = false"
    @save="includePasswordInList"
  />
  <button
    class="
      bg-gray-500
      hover:bg-gray-700
      text-gray-200
      py-2
      px-2
      border border-gray-200
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
          v-if="folders.length > 0"
          class="flex items-center mr-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="hidden md:block">
          {{ $t('passwords.folder-filter.title') }}
          </span>
          <template v-if="selectedFolderIds.length > 0">
            ({{ selectedFolderIds.length }})
          </template>
        </WinkleButton>
        <FolderFilterDropdown
          :folders="folders"
          :selectedIds="selectedFolderIds"
          v-if="isShowingSortDropdown"
          @close="isShowingSortDropdown = false"
          @save="saveSorting"
        />
        <WinkleButton class="mr-1 flex items-center" size="sm" @click="toggleAllFolders(false)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
          <span class="hidden md:block">
          {{ $t('passwords.hide-folders') }}
          </span>
        </WinkleButton>

        <WinkleButton class="flex items-center" size="sm" @click="toggleAllFolders(true)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
          <span class="hidden md:block">
            {{ $t('passwords.show-folders') }}
          </span>
        </WinkleButton>
      </div>

      <div class="md:w-auto flex border-b items-center bg-gray-100 rounded px-2 py-1 shadow">
        <label for="search-input">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </label>
        <input
          id="search-input"
          type="text"
          class="
            ml-4
            bg-gray-100
            border border-none border-b-2
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
      v-if="selectedFolderIds.length === 0 || selectedFolderIds.includes('0')"
    >
      <div
        class="border-b border-gray-400 w-full text-left uppercase select-none cursor-pointer"
        @click="emptyFolderIsOpen = !emptyFolderIsOpen"
      >
        <button>
          <svg v-if="!emptyFolderIsOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          <svg v-if="emptyFolderIsOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button> {{ $t('passwords.without-folder') }} ({{ passwordsWithoutFolder.length }})
      </div>
      <div class="flex items-center flex-wrap w-full mt-6" v-show="emptyFolderIsOpen">
        <div class="mt-2 text-gray-400" v-if="filteredPasswords.length === 0">
          <p v-if="filter.length === 0">
            {{ $t("passwords.empty-list") }}
            <span
              class="hover:text-gray-500 cursor-pointer"
              @click="isCreating = true"
            >
              {{ $t("passwords.clicking-here") }}
            </span>
          </p>
          <p v-if="filter.length > 0">
            {{ $t("passwords.empty-filtered-list", { filter }) }}
          </p>
        </div>
        <template v-else>
          <PasswordCard
            v-for="password in passwordsWithoutFolder"
            :key="password.id"
            :password="password"
            @edit="editingPassword = { ...password }"
            @remove="removePasswordFromList"
          />
        </template>
      </div>
    </div>

    <template v-if="filteredPasswords.length > 0">
      <div class="w-full my-6" v-for="folder in filteredFolders" :key="folder.id">
        <div
          class="border-b border-gray-400 w-full text-left uppercase select-none cursor-pointer"
          @click="folder.isOpen = !folder.isOpen"
        >
          <button>
            <svg v-if="!folder.isOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <svg v-if="folder.isOpen" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button> {{ folder.name }} ({{ passwordsInFolder(folder.id).length }})
        </div>
        <div class="flex items-center flex-wrap w-full mt-6" v-if="folder.isOpen">
          <PasswordCard
            v-for="password in passwordsInFolder(folder.id)"
            :key="password.id"
            :password="password"
            @edit="editingPassword = { ...password }"
            @remove="removePasswordFromList"
          />
        </div>
      </div>
    </template>
  </DashboardContainer>
</template>
