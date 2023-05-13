<script setup lang="ts">
import { onMounted, computed, Ref, ref, watch } from 'vue';
import { IPassword } from '../../repositories/passwords/IPassword';

import EditPasswordModal from '../../components/password/EditPasswordModal.vue';
import PasswordCard from '../../components/password/PasswordCard.vue';
import DashboardHeader from '../../components/shared/DashboardHeader.vue';
import DashboardContainer from '../../components/shared/DashboardContainer.vue';
import WinkleButton from '../../components/shared/WinkleButton.vue';
import FolderFilterDropdown from '../../components/password/FolderFilterDropdown.vue';
import ImportPasswordsModal from '../../components/password/ImportPasswords/ImportPasswordsModal.vue';
import PasswordStore from '../../store/passwords/PasswordStore';
import PasswordFolderToggle from '../../components/password/PasswordFolderToggle.vue';
import CreateNew from '../../components/password/CreateNew.vue';
import FolderIcon from '../../components/icons/FolderIcon.vue';
import FilterIcon from '../../components/icons/FilterIcon.vue';
import ImportIcon from '../../components/icons/ImportIcon.vue';
import SearchIcon from '../../components/icons/SearchIcon.vue';

const isImportingPasswords: Ref<boolean> = ref(false);
const editingPassword: Ref<IPassword | null> = ref(null);
const filter: Ref<string> = ref('');
const isShowingSortDropdown: Ref<boolean> = ref(false);

const passwordsWithoutFolder = computed(() => {
  return filteredPasswords.value.filter((p) => p.folder.id === '');
});

const filteredFolders = computed(() => {
  if (PasswordStore.selectedFolderIds.value.length === 0) {
    return PasswordStore.foldersList.value;
  }

  return PasswordStore.foldersList.value.filter((folder) =>
    PasswordStore.selectedFolderIds.value.includes(folder.id)
  );
});

const showWithoutFolders = computed(() => {
  return (
    PasswordStore.selectedFolderIds.value.length === 0 ||
    PasswordStore.selectedFolderIds.value.includes('0')
  );
});

const filteredPasswords = computed(() => {
  const list =
    !filter.value || filter.value === ''
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

const changePasswordInList = (newPassword: IPassword) => {
  PasswordStore.changePasswordInList(newPassword);
  editingPassword.value = null;
};

const passwordsInFolder = (folderId: string) => {
  return filteredPasswords.value.filter((p) => p.folder.id === folderId);
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
  <CreateNew />
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
          <FilterIcon class="mr-1" />
          <span class="hidden md:block mr-1">
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
          <FolderIcon class="mr-1" />
          <span class="hidden md:block">
            {{ $t('passwords.toggle-folders') }}
          </span>
        </WinkleButton>
        <WinkleButton
          class="mr-1 items-center hidden md:flex"
          @click="isImportingPasswords = !isImportingPasswords"
          :title="$t('passwords.import.title')"
        >
          <ImportIcon />
        </WinkleButton>
        <ImportPasswordsModal
          v-if="isImportingPasswords"
          @close="isImportingPasswords = false"
          @save="() => {}"
        />
      </div>

      <div
        class="md:w-auto flex border-b items-center bg-gray-100 dark:bg-gray-600 dark:border-gray-600 rounded px-2 py-1 shadow"
      >
        <label for="search-input">
          <SearchIcon class="text-gray-600 dark:text-gray-100" />
        </label>
        <input
          id="search-input"
          type="text"
          v-model="filter"
          :placeholder="$t('passwords.search')"
          autocomplete="off"
        />
      </div>
    </div>

    <!-- Without category -->
    <div class="w-full mb-4" v-if="showWithoutFolders">
      <PasswordFolderToggle
        @toggle="
          PasswordStore.emptyFolderIsOpen.value =
            !PasswordStore.emptyFolderIsOpen.value
        "
        :isOpen="PasswordStore.emptyFolderIsOpen.value"
        :name="$t('passwords.without-folder')"
        :count="passwordsWithoutFolder.length"
      />

      <div
        class="flex items-center flex-wrap w-full mt-4"
        v-show="PasswordStore.emptyFolderIsOpen.value"
      >
        <div class="text-gray-400" v-if="passwordsWithoutFolder.length === 0">
          <p class="ml-4">
            <template v-if="filter.length === 0">
              {{ $t('passwords.empty-list') }}
            </template>
            <template v-else>
              {{ $t('passwords.empty-filtered-list', { filter }) }}
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
      <PasswordFolderToggle
        @toggle="folder.isOpen = !folder.isOpen"
        :isOpen="folder.isOpen || false"
        :name="folder.name"
        :count="passwordsInFolder(folder.id).length"
        :folderId="folder.id"
      />

      <div class="flex items-center flex-wrap w-full mt-4" v-if="folder.isOpen">
        <div
          class="text-gray-400"
          v-if="passwordsInFolder(folder.id).length === 0"
        >
          <p class="ml-4">{{ $t('passwords.folder-is-empty') }}</p>
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

<style lang="postcss" scoped>
#search-input {
  @apply ml-4 w-24 md:w-full
          bg-gray-100 dark:bg-gray-600
          border border-none border-b-2
          dark:border-gray-600
          focus:border-none
          !outline-none;
}
</style>
