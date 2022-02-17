<script setup lang="ts">
import { onMounted, computed, Ref, ref } from "vue";
import { IPassword } from "../../repositories/passwords/IPassword";
import { IFolder } from "../../repositories/passwords/IFolder";
import PasswordRepository from "../../repositories/passwords/PasswordRepository";
import WinkleScripts from "../../scripts/WinkleScripts";

import EditPasswordModal from "../../components/password/EditPasswordModal.vue";
import PasswordCard from "../../components/password/PasswordCard.vue";
import CreatePasswordModal from "../../components/password/CreatePasswordModal.vue";

import { showNotification } from "../../scripts/NotificationScript";
import i18n from "../../scripts/internacionalization/i18n";
import showErrorMessage from "../../scripts/ErrorLogs";
import LoginRepository from "../../repositories/login/LoginRepository";
import router from "../../router";
import DashboardHeader from "../../components/shared/DashboardHeader.vue";
import DashboardContainer from "../../components/shared/DashboardContainer.vue";

const { t } = i18n.element.global;

const passwords: Ref<IPassword[]> = ref([]);
const folders: Ref<IFolder[]> = ref([]);
const emptyFolderIsOpen: Ref<boolean> = ref(true);

const editingPassword: Ref<IPassword | null> = ref(null);
const isCreating: Ref<boolean> = ref(false);
const filter: Ref<string> = ref("");
const header: Ref<HTMLElement | null> = ref(null);

const contentHeight = computed(() => {
  const headerHeight = header.value?.clientHeight || 0;
  const hh = headerHeight - 20;
  return { height: `calc(100% - (${hh}px))` };
});

const passwordsWithoutFolder = computed(() => {
  return filteredPasswords.value
    .filter((p: IPassword) => !p.folderId || p.folderId === '');
});

const filteredPasswords = computed(() => {
  let list: IPassword[];

  if (!filter.value || filter.value === "") list = passwords.value;
  list = passwords.value
    .filter((p) => {
      const filterValue = filter.value.toLowerCase();
      const containsName = p.name.toLowerCase().search(filterValue) > -1;
      const containsUrl = p.url.toLowerCase().search(filterValue) > -1;
      return containsName || containsUrl;
    });

    return list.sort((a: IPassword, b: IPassword) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
});

const loadFolders = async () => {
  WinkleScripts.setLoading(true);
  const foldersList = await PasswordRepository.getFolders();
  folders.value = foldersList;
  WinkleScripts.setLoading(false);
};

const getData = async () => {
  WinkleScripts.setLoading(true);
  const foldersList = await PasswordRepository.getFolders();
  const passwordsList = await PasswordRepository.getPasswords();
  passwords.value = passwordsList;
  folders.value = foldersList;
  WinkleScripts.setLoading(false);
};

interface PasswordIncluded {
  newPassword: IPassword;
  willReloadFolders: boolean;
}

const includePasswordInList = (e: PasswordIncluded) => {
  console.log({e});
  passwords.value.push(e.newPassword);
  isCreating.value = false;
  showNotification(t("passwords.created"), e.newPassword.name, "success");
  if (e.willReloadFolders) loadFolders();
};

const changePasswordInList = (e: PasswordIncluded) => {
  const index = passwords.value.findIndex((p) => p.id === e.newPassword.id);
  passwords.value[index] = e.newPassword;
  editingPassword.value = null;
  showNotification(t("passwords.updated"), e.newPassword.name, "success");
  if (e.willReloadFolders) loadFolders();
};

const removePasswordFromList = (passwordId: number) => {
  const index = passwords.value.findIndex((p) => Number(p.id) === passwordId);
  passwords.value.splice(index, 1);
  showNotification(t("passwords.removed"), "", "success");
  loadFolders();
};

onMounted(() => { getData(); });
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  </button>
  <DashboardHeader :title="$t('passwords.title')" ref="header" @search="filter = $event" />
  <DashboardContainer :style="contentHeight">
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

    <div v-else>
      <div class="w-full mt-4">
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
          </button> Sem categoria ({{ passwordsWithoutFolder.length }})
        </div>
        <div
          class="flex items-center flex-wrap w-full mt-4"
          v-show="emptyFolderIsOpen"
        >
          <PasswordCard
            v-for="password in passwordsWithoutFolder"
            :key="password.id"
            :password="password"
            @edit="editingPassword = password"
            @remove="removePasswordFromList"
          />
        </div>
      </div>

      <div class="w-full mt-4" v-for="folder in folders" :key="folder.id">
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
          </button> {{ folder.name }} ({{ filteredPasswords.filter(p => p.folderId === folder.id).length }})
        </div>
        <div
          class="flex items-center flex-wrap w-full mt-4"
          v-show="folder.isOpen"
        >
          <PasswordCard
            v-for="password in filteredPasswords.filter(p => p.folderId === folder.id)"
            :key="password.id"
            :password="password"
            @edit="editingPassword = password"
            @remove="removePasswordFromList"
          />
        </div>
      </div>

    </div>

    <!-- div class="flex items-center justify-center w-full mt-4 flex-wrap" v-else>
      <PasswordCard
        v-for="password in filteredPasswords"
        :key="password.id"
        :password="password"
        @edit="editingPassword = password"
        @remove="removePasswordFromList"
      />
      <div
        class="
          w-full
          md:w-80 md:mx-2
          mb-7
          transition-all
          duration-200
          h-40
          flex
          justify-center
          items-center
        "
      >
        <button
          class="
            w-16
            h-16
            rounded-full
            bg-gray-200
            border
            shadow-lg
            flex
            justify-center
            items-center
            transition-all
            duration-200
            hover:scale-110
          "
          @click="isCreating = true"
          :title="$t('passwords.create')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div -->
  </DashboardContainer>
</template>
